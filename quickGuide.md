# Editing Content with TinaCMS – Quick Guide

## 1. Logging In

- Go to: /admin
- Click the **“Enter Edit Mode”** button when the prompt appears.
  ![Edit Mode](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/unnamed.png)

- Select **“Sign in with Google”** and log in using your Recro email address.
- After signing in, you’ll be redirected to the CMS dashboard where you can begin editing content.

---

## 2. Navigating the CMS with Inline Editing

### After logging in:

#### View the Interface

- The sidebar will appear on the left, and the landing page will be on the right.
- Editable sections on the page will be highlighted with blue boxes.

#### Edit a Section

- Click any blue box to edit that section.
- The sidebar will automatically switch to show the editable fields for that specific content block.
  ![Edit Mode](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/edit.png)

#### Navigate to a Different Page

- Click the left arrow icon at the top of the sidebar to collapse it.
- This lets you browse the site normally by clicking links as you would on the live site.

#### Edit a Different Page

- Once on the page you want to edit, click the blue pencil icon (✏️) in the top-left corner.
- The page will reload in edit mode, and the blue editable boxes will reappear.
  ![NoEdit](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/site.png)

---

## 3. Navigating TinaCMS Through the CMS Hub

### After logging in:

#### View the Interface

- The sidebar will appear on the left, and the landing page will be on the right.

#### Open the Sidebar Menu

- Locate the menu icon to the left of the sidebar.
- Click it.
- A new sidebar will slide in over the existing one.
  ![Sidebar](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/logout.png)

#### Access Collections

- In the new sidebar, you'll see a list of all collections.
- Click on the collection you want to work with.

#### Navigate to Files

- The CMS will display the file list within that collection.
- Click on the file name you want to edit.
- Or click **"Add Files"** in the top-right corner to create a new file.
  ![Nav](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/nav.png)

#### Edit or Add Content

- If a page exists for that file, TinaCMS will redirect to inline editing (from Step 2).
- If not, you'll see a form view showing all available fields for editing.
  ![AddContent](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/file.png)

#### Work with Fields, Blocks, and Links

- For fields that contain blocks or links:
  - Click the ✏️ pencil icon to edit the item.
  - Click the 🗑️ trash icon to delete it.
  - Click the ➕ plus icon to add more items.

#### Name New File

- If you're creating a new file, don’t forget to:
  - Enter a file name before saving or publishing.
  - For a new page, the file name determines the route. For example, if you create a page named values1, the page will be available at "/values1".

## ![NewFile](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/new.png)

## 4. Rich-Text

### After Logging In:

- Click on a field that is the same as the picture below:
  ![Save](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/save.png)

- Rich Text Instructions:
  - To make a word or phrase orange, highlight it and click B (Bold) in the rich-text toolbar above
  - To keep a word its normal color (such as white or grey), make sure it isn’t bolded.
  - To add a line break with extra spacing between paragraphs, press Shift + Enter.
  - Match the heading styles (H1, H3, etc.) to the format shown in the example above.

---

## 5. Saving Content

### After Logging In:

- Click **"Save"**
  - Once you've finished editing your content (in either form or inline view), click the **"Save"** button.
  - You'll find this button at the bottom of the sidebar or window you're working in.
    ![Save](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/save.png)

- Wait for TinaCMS to Process
  - TinaCMS will begin saving your content.
  - A loading indicator will appear, and the CMS will notify you once the save is complete.

- Wait for Redeployment
  - After saving, the site will automatically redeploy to reflect the updated content. This takes a few minutes.

---

## 6. Managing Media in TinaCMS

### After Logging In:

#### Open the Sidebar Menu

- Locate the menu icon to the left of the sidebar.
- Click it.
- A new sidebar will slide in over the existing one.
  ![Sidebar](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/logout.png)

#### Open the Media Manager

- From the main sidebar, click on **"Media Manager"**.
- This will open the media view where you can browse files and folders.

#### Browse Media Files

- You'll see a list of folders and media files.
- Click on any folder to view its contents.
- To go back, click the back arrow next to the **Media/FolderName** breadcrumb at the top.
  ![Folder](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/folder.png)

#### Delete Media

- Click on a media file to select it.
- A sidebar will appear on the right.
- Scroll to the bottom of that sidebar and click the **"Delete"** button if you want to remove the file.
  ![media](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/media.png)

#### Upload New Media

- To upload new files, click the **"Upload"** button in the top-right corner of the Media sidebar.
- Choose the media files you want to add from your device.

#### Create and Use Folders

- To organize your media:
  - Click the **"New Folder"** button in the top-right corner.
  - Give your folder a name, then click **"Submit"**.
  - Navigate into the new folder and upload media as described above.

---

## 7. Scrolling to Section Link

### After Logging In:

- **Add ID and Scroll Position to a Section**
  - Navigate to the section you want to add the scroll effect to.
  - Click on a field to open that section in the CMS.
  - Add an ID and scroll position as shown below:  
    ![id](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/idScroll.png)
  - Click **Save**.

- **Add Link to Navigation Bar**
  - Click on the navigation link that corresponds to the section.
  - Add a sublink.
  - Choose the section ID and fill out the remaining fields the same way as you did for the section, as shown in the example below:  
    ![idNav](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/navIdScroll.png)
  - Click **Save**.

---

## 8. Troubleshoot

### Try Logging Out

- Click the menu icon at the top left of the sidebar.
- A new sidebar will appear.
- Click the three dots (⋮) at the top right of this new sidebar.
- Select **Log out**.
- Once logged out, retry Step 1 of your original process.
  ![logout](https://recro-landing-site.s3.us-east-1.amazonaws.com/QuickGuide/logout.png)

### Clear Your Cookies

#### Google Chrome

1. Open Chrome.
2. Click the three dots (⋮) in the top-right corner.
3. Go to **Settings → Privacy and security**.
4. Click **Clear browsing data**.
5. Choose **Cookies and other site data**, then click **Clear data**.

#### Safari (macOS)

1. Open Safari.
2. Go to **Safari > Settings (or Preferences)**.
3. Click the **Privacy** tab.
4. Click **Manage Website Data**.
5. Click **Remove All**, or choose specific sites to delete.
6. Click **Done**.

---

### Contact Support

**Email**: [ashton.howard@recro.com](mailto:ashton.howard@recro.com)
