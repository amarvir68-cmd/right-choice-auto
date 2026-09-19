# Vehicle gallery and responsive detail fix

- Fixes vehicle detail column overflow and clipped title / call button.
- Adds previous and next buttons to the main image, in addition to full-screen navigation.
- Adds thumb navigation, keyboard left/right, mobile swipe in full-screen mode, click-to-zoom and click-again-to-fit.
- Images use object-fit: contain and scale responsively without stretching. Browser zoom also respects the responsive grid.
- Close full-screen with Escape or Close.

## Deploy
Replace public-site contents in your public GitHub repo and redeploy the PUBLIC Vercel project. Admin and database unchanged. Test with a multi-image vehicle at 100%, 125%, and 150% browser zoom on desktop and on mobile.

Note: This is a source fix, not a verified live deployment; do not claim live functionality until browser tested.
