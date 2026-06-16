
create policy "verifications owner manage"
on storage.objects for all to authenticated
using (bucket_id = 'verifications' and owner = auth.uid())
with check (bucket_id = 'verifications' and owner = auth.uid());

create policy "verifications admin read"
on storage.objects for select to authenticated
using (bucket_id = 'verifications' and public.has_role(auth.uid(), 'admin'));

create policy "product-files owner manage"
on storage.objects for all to authenticated
using (bucket_id = 'product-files' and owner = auth.uid())
with check (bucket_id = 'product-files' and owner = auth.uid());

create policy "product-files admin read"
on storage.objects for select to authenticated
using (bucket_id = 'product-files' and public.has_role(auth.uid(), 'admin'));

create policy "product-images owner manage"
on storage.objects for all to authenticated
using (bucket_id = 'product-images' and owner = auth.uid())
with check (bucket_id = 'product-images' and owner = auth.uid());

create policy "product-images authenticated read"
on storage.objects for select to authenticated
using (bucket_id = 'product-images');
