# Harbor & Vine detailed restaurant site

Pages: homepage, menu, live wine list, private dining, story, contact, and reservations.

## Google Sheet wine connection

1. Create a dedicated public tab named `Wine List`.
2. Use headers: `Name, Producer, Vintage, Type, Country, Region, Grape, Bottle Price, Glass Price, Stock, Featured, Notes`.
3. In Google Sheets select **File > Share > Publish to web**. Choose only the Wine List tab and choose **CSV**.
4. Copy the published CSV URL into `wine-config.js`.
5. Keep sensitive information out of the published tab because published content is public.

The wine page searches names, producers, grapes, regions, countries and notes. It filters type, country, in-stock status and by-the-glass availability.
