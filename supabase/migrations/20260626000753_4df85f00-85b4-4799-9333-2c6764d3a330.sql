-- 1. affiliate_commissions: block client writes, keep owner read
DROP POLICY IF EXISTS "Owners manage their commissions" ON public.affiliate_commissions;
CREATE POLICY "Owners view their commissions" ON public.affiliate_commissions
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "No client writes commissions ins" ON public.affiliate_commissions
  AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No client writes commissions upd" ON public.affiliate_commissions
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false);
CREATE POLICY "No client writes commissions del" ON public.affiliate_commissions
  AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

-- 2. affiliate_links: validate program exists and is active on insert/update
DROP POLICY IF EXISTS "Affiliates manage their links" ON public.affiliate_links;
CREATE POLICY "Affiliates view their links" ON public.affiliate_links
  FOR SELECT TO authenticated USING (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates create links for valid programs" ON public.affiliate_links
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = affiliate_id
    AND EXISTS (
      SELECT 1 FROM public.affiliate_programs p
      WHERE p.id = affiliate_links.program_id AND p.status = 'active'
    )
  );
CREATE POLICY "Affiliates update links for valid programs" ON public.affiliate_links
  FOR UPDATE TO authenticated
  USING (auth.uid() = affiliate_id)
  WITH CHECK (
    auth.uid() = affiliate_id
    AND EXISTS (
      SELECT 1 FROM public.affiliate_programs p
      WHERE p.id = affiliate_links.program_id AND p.status = 'active'
    )
  );
CREATE POLICY "Affiliates delete their links" ON public.affiliate_links
  FOR DELETE TO authenticated USING (auth.uid() = affiliate_id);

-- 3. course_progress: require a paid order for the course
DROP POLICY IF EXISTS "Users manage their own progress" ON public.course_progress;
CREATE POLICY "Users view their own progress" ON public.course_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert progress for purchased courses" ON public.course_progress
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.courses c
      JOIN public.orders o ON o.product_id = c.product_id::text
      WHERE c.id = course_progress.course_id
        AND o.buyer_id = auth.uid()
        AND o.status = 'paid'
    )
  );
CREATE POLICY "Users update progress for purchased courses" ON public.course_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.courses c
      JOIN public.orders o ON o.product_id = c.product_id::text
      WHERE c.id = course_progress.course_id
        AND o.buyer_id = auth.uid()
        AND o.status = 'paid'
    )
  );
CREATE POLICY "Users delete their own progress" ON public.course_progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. downloads: scoped insert for buyers who purchased the product
CREATE POLICY "Buyers log downloads for purchased products" ON public.downloads
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.product_id = downloads.product_id::text
        AND o.buyer_id = auth.uid()
        AND o.status = 'paid'
    )
  );

-- 5. notifications: block client inserts, keep owner full read/update/delete
DROP POLICY IF EXISTS "Users manage their notifications" ON public.notifications;
CREATE POLICY "Users view their notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update their notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete their notifications" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "No client inserts notifications" ON public.notifications
  AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);

-- 6. ticket_messages: allow ticket customers to read and write
CREATE POLICY "Customers read their ticket messages" ON public.ticket_messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_messages.ticket_id AND t.customer_id = auth.uid()
    )
  );
CREATE POLICY "Customers write their ticket messages" ON public.ticket_messages
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_messages.ticket_id AND t.customer_id = auth.uid()
    )
  );