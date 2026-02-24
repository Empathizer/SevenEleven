# Support Chat System Implementation

## ✅ COMPLETED

### 1. Store Updates
- Added `Message` interface to lib/store.ts
- Added `messages` array to Store class
- Added chat methods:
  - `sendMessage()` - Send message between users
  - `getMessages()` - Get conversation between two users
  - `getUnreadCount()` - Count unread messages
  - `markAsRead()` - Mark message as read
  - `getCustomerChats()` - Get all customer conversations for admin
  - `getSellerChats()` - Get all seller conversations for admin

## 📋 TODO - Create These Files

### Admin Pages (2 pages needed)

1. **app/admin/customer-support/page.tsx**
   - List all customers who have sent messages
   - Show unread count badge
   - Click to open chat dialog
   - Real-time message list
   - Reply functionality

2. **app/admin/seller-support/page.tsx**
   - List all sellers who have sent messages
   - Show unread count badge
   - Click to open chat dialog
   - Real-time message list
   - Reply functionality

### Customer/Seller Support Components

3. **components/support-chat.tsx**
   - Floating chat button (bottom right)
   - Chat dialog/modal
   - Message list
   - Send message input
   - For customers on website
   - For sellers in seller dashboard

### Navigation Updates

4. **app/admin/layout.tsx**
   - Add "Customer Support" link
   - Add "Seller Support" link
   - Show unread count badges

5. **components/store-header.tsx** (Customer)
   - Add support chat button
   - Show unread count

6. **app/seller/layout.tsx** (if exists)
   - Add support chat button
   - Show unread count

## 🎨 UI Design

### Chat Button (Floating)
```tsx
<button className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg">
  <MessageCircle />
  {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
</button>
```

### Chat Dialog
- Header: "Support Chat" / "Chat with Admin"
- Message list (scrollable)
- Input field at bottom
- Send button

### Admin Support Pages
- Left sidebar: List of users with messages
- Right panel: Selected conversation
- Unread badge on each user

## 🔧 Implementation Steps

1. Run: `git add -A && git commit -m "Add message system to store"`
2. Create admin/customer-support/page.tsx
3. Create admin/seller-support/page.tsx
4. Create components/support-chat.tsx
5. Update admin layout navigation
6. Add chat button to customer header
7. Add chat button to seller dashboard

Would you like me to create these files now?
