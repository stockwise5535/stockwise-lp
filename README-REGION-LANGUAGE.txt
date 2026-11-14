Stockwise Region Language Update

Automatic region routing on Vercel:
- Japan (JP) -> /ja/ Japanese
- Taiwan (TW) -> /zh-tw/ Traditional Chinese
- China (CN) -> /zh-cn/ Simplified Chinese
- All other regions -> /en/ English

A manual language selector is also available in the top navigation.

Existing links:
- Login -> https://stockwise-app-1qz9.vercel.app/
- Try Stockwise -> https://stockwise-app-1qz9.vercel.app/
- Related insight -> https://note.com/nexops

Deployment:
Copy all files/folders from this package into your existing Vercel-linked homepage folder, including vercel.json, then run:
npx vercel --prod
