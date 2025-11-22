# SiPOS & SUPiS Community Implementation

## Overview
The SiPOS & SUPiS service has been implemented as a two-room community system based on employment type, accessible directly from the services section on the homepage:

1. **Business Room** - For selbständige (self-employed) users
2. **Tal der SIPOS** - For angestellte (employed) users

## Architecture

### Pages Created

#### 1. BusinessRoomPage (`src/pages/BusinessRoomPage.tsx`)
- Exclusive community for selbständige users
- Features:
  - Post creation (news/questions)
  - Comment system
  - Edit/delete own posts and comments
  - Filtered views (all/news/questions)
- Access control: Redirects non-selbständige users back to homepage
- Blue color scheme (matching business theme)

#### 2. SipoNewsPage (`src/pages/SipoNewsPage.tsx`) - existing
- Now serves as "Tal der SIPOS"
- Community for angestellte users
- Yellow color scheme (matching SIPO branding)
- Same features as Business Room

### Database Schema

New migration: `20251122100000_create_business_room_tables.sql`

**Tables:**
- `business_posts`: Stores posts for Business Room
- `business_comments`: Stores comments on business posts

**RLS Policies:**
- Only selbständige users can view/create posts and comments
- Users can only edit/delete their own content
- Automatic filtering by employment_type from workers table

### Routing

**Routes in App.tsx:**
```typescript
/business-room      -> BusinessRoomPage (selbständige only)
/sipo-news          -> SipoNewsPage (angestellte - Tal der SIPOS)
```

### UI Implementation

**Services.tsx - SiPOS & SUPiS Section:**
- Featured section with two clickable buttons
- **Business Room Button** (Blue):
  - Links directly to `/business-room`
  - Icon: Briefcase
  - Description: "Für selbständige Subunternehmer"

- **Tal der SIPOS Button** (Yellow):
  - Links directly to `/sipo-news`
  - Icon: Users
  - Description: "Für angestellte Bauleiter"

Both buttons are always visible and clickable. Access control happens on the target pages.

## Access Control Logic

### BusinessRoomPage
```typescript
- On page load, check if user exists
- Check if user.employment_type === 'selbständig'
- If not authenticated: Redirect to /siportal
- If wrong employment type: Alert + redirect to /siportal
```

### SipoNewsPage (Tal der SIPOS)
```typescript
- Currently open to all authenticated users
- Could be restricted to angestellte users in future
```

## Data Separation

- **Business Room**: Uses `business_posts` and `business_comments` tables
- **Tal der SIPOS**: Uses existing `posts` and `comments` tables
- Complete data separation between the two communities

## Design Consistency

- Both rooms use similar UI/UX patterns
- Business Room: Blue accent color (#3B82F6)
- Tal der SIPOS: Yellow accent color (#FACC15)
- Both support:
  - Post creation modal
  - Post detail modal with comments
  - Filter tabs (All/News/Questions)
  - Edit/delete functionality
  - Back button to homepage (/siportal)

## Migration Required

Run the following command to apply the database migration:

```bash
npx supabase migration up
```

Or apply the SQL manually in Supabase dashboard:
`supabase/migrations/20251122100000_create_business_room_tables.sql`

## User Flow

1. User visits homepage (/siportal)
2. Scrolls to SiPOS & SUPiS section
3. Sees two buttons: "Business Room" and "Tal der SIPOS"
4. Clicks appropriate button based on their role
5. If access is denied (wrong employment type), redirected back to homepage
6. If access granted, can create posts and engage with community

## Future Enhancements

1. Add RLS policy to SipoNewsPage for angestellte-only access
2. Add notification system for new posts
3. Add post reactions/likes
4. Add file attachment support
5. Add user profiles in posts
6. Add search functionality within each room
7. Add email notifications for replies to posts
