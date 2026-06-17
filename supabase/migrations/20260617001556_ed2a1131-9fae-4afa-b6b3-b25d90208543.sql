CREATE POLICY "product-images public read"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'product-images');