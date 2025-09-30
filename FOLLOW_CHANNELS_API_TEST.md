# 📡 Follow Channels API Test

## ✅ API Route Created: `/api/follow-channels`

### 🔧 **Features Implemented:**

1. **✅ GET Method** - Retrieve user's followed channels
2. **✅ POST Method** - Toggle channel follow status
3. **✅ Authentication** - NextAuth session validation
4. **✅ Error Handling** - Comprehensive try-catch blocks
5. **✅ Cache Control** - `no-store` headers
6. **✅ Input Validation** - Channel name validation

### 📋 **API Endpoints:**

#### **GET /api/follow-channels**

```javascript
// Retrieve user's followed channels
const response = await fetch("/api/follow-channels", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

const data = await response.json();
// Returns: { followedChannels: ['Devrim Akyıl', 'İslam Memiş'] }
```

#### **POST /api/follow-channels**

```javascript
// Toggle channel follow status
const response = await fetch("/api/follow-channels", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    channelName: "İslam Memiş",
  }),
});

const data = await response.json();
// Returns: { followedChannels: ['Devrim Akyıl', 'İslam Memiş'] }
```

### 🧪 **Test Scenarios:**

#### **Test 1: Get Followed Channels**

```bash
# Test GET endpoint
curl -X GET http://localhost:3000/api/follow-channels \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

**Expected Response:**

```json
{
  "followedChannels": ["Devrim Akyıl", "İslam Memiş"]
}
```

#### **Test 2: Follow a Channel**

```bash
# Test POST endpoint - Follow channel
curl -X POST http://localhost:3000/api/follow-channels \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{"channelName": "Bloomberg HT"}'
```

**Expected Response:**

```json
{
  "followedChannels": ["Devrim Akyıl", "İslam Memiş", "Bloomberg HT"]
}
```

#### **Test 3: Unfollow a Channel**

```bash
# Test POST endpoint - Unfollow channel
curl -X POST http://localhost:3000/api/follow-channels \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{"channelName": "İslam Memiş"}'
```

**Expected Response:**

```json
{
  "followedChannels": ["Devrim Akyıl", "Bloomberg HT"]
}
```

### 🔒 **Authentication Flow:**

1. **✅ Session Check**: `getServerSession(authOptions)`
2. **✅ User ID Validation**: `session?.user?.id`
3. **✅ Database Query**: `User.findById(session.user.id)`
4. **✅ Authorization**: Return 401 if not authenticated

### 🛡️ **Error Handling:**

#### **401 Unauthorized**

```json
{
  "error": "Unauthorized"
}
```

#### **404 User Not Found**

```json
{
  "error": "User not found"
}
```

#### **400 Bad Request**

```json
{
  "error": "Channel name is required"
}
```

#### **500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

### 🔄 **Toggle Logic:**

```javascript
// If channel is already followed, unfollow it
if (user.followedChannels.includes(channelName)) {
  user.followedChannels = user.followedChannels.filter(
    (c) => c !== channelName
  );
} else {
  // If channel is not followed, follow it
  user.followedChannels.push(channelName);
}
```

### 📊 **Database Operations:**

- **✅ MongoDB Connection**: `await connectMongo()`
- **✅ User Lookup**: `User.findById(session.user.id)`
- **✅ Array Operations**: Add/remove from `followedChannels`
- **✅ Save Changes**: `await user.save()`

### 🚀 **Usage Examples:**

#### **Frontend Integration:**

```javascript
// Follow a channel
const followChannel = async (channelName) => {
  try {
    const response = await fetch("/api/follow-channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelName }),
    });

    const data = await response.json();
    console.log("Updated channels:", data.followedChannels);
  } catch (error) {
    console.error("Error following channel:", error);
  }
};

// Get followed channels
const getFollowedChannels = async () => {
  try {
    const response = await fetch("/api/follow-channels");
    const data = await response.json();
    return data.followedChannels;
  } catch (error) {
    console.error("Error getting channels:", error);
    return [];
  }
};
```

### ✅ **Success Criteria:**

- ✅ **Authentication**: Only authenticated users can access
- ✅ **Toggle Functionality**: Follow/unfollow channels
- ✅ **Error Handling**: Proper error responses
- ✅ **Cache Control**: No-store headers
- ✅ **Input Validation**: Channel name validation
- ✅ **Database Integration**: MongoDB operations
- ✅ **User Model**: Uses `followedChannels` field

The API is ready for testing and integration! 🎉
