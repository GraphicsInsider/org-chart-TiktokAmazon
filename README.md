# TikTok Amazon Org Chart

Developed from [tiny-svelte template](https://github.com/GraphicsInsider/tiny-svelte).
and [org-chart-template](https://github.com/GraphicsInsider/org-chart-template) Find the quick start and other useful docs there.

### org-chart-TikTokAmazon

- [Google Sheets](https://docs.google.com/spreadsheets/d/1-bA2oxHDPbGBzA9Jpv6UbsjFk0Gi-7TGwE2fIoRUMt8/edit?gid=0#gid=0)
- [Muse Preview](https://www.businessinsider.com/tiktok-org-chart-reveals-how-us-e-commerce-team-run-2026-11)

### Org-chart-template

- [Google Sheets Template](https://docs.google.com/spreadsheets/d/1_t_a7iAWSulTrY3IZqCMEUgI5Pcg8PUqF3RPSflNcIU/edit?gid=1398059150#gid=1398059150)
- [Muse Demo Preview](https://businessinsider.com/post/preview?stories&post_id=69bd54e0d097316b35d7200c&bust-capi=&skip_transform=true)

### Getting Build Data

This template use Google Sheets formatted as [ArchieML](http://archieml.org/), which can be used as an external CMS to provide more flexibility in data structuring. Tag the Google Sheet for your graphic in `src/data/meta.json` and make sure you have the ID and sheet ID (gid) filled out correctly. Make sure the share permissions on the sheet are set up so that it is viewable by anyone with the share link. **Don't make it available to edit by anybody!**

To pull the latest data from the spreadsheet.

```bash
npm run data
```


