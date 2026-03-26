# NibrasTube Product Requirements Document (PRD)

## 1. Product Vision

NibrasTube aims to provide a 100% safe, parent-curated video experience for children. Unlike traditional YouTube Kids, where algorithms decide appropriateness, NibrasTube gives parents the power to whitelist specific videos for their kids, ensuring zero exposure to unintended content.

## 2. Target Audience

- **Parents** who are concerned about YouTube's automated content filtering.
- **Children (Ages 2-12)** who want to browse and watch their favorite shows in a safe environment.
- **Caregivers/Educators** who want to curate educational playlists for children.

## 3. Key Features

### 3.1 Parent Portal

- **Secure Authentication**: Parents create an account via Email/Password or Social Login.
- **Kid Profiles**: Create multiple kid profiles with custom names and avatars.
- **Shared Management**: Invite another parent (e.g., spouse) to manage the same kid profiles.
- **Whitelisting (The "Pin" Feature)**:
  - Search global YouTube via the YouTube Data API.
  - Preview videos before approving.
  - Pin videos to one or more kid profiles.
- **Dashboard**: View what each kid is watching and manage the approved list.

### 3.2 Kids Portal

- **Whitelisted Content Grid**: A simple, visual grid of ONLY the videos pinned by parents.
- **Internal Search**: Kids can search _only_ within their approved list of videos.
- **Restricted Environment**: No access to global YouTube search, no "related videos" outside the whitelist, and no comments/engagement features.
- **Kid-Friendly Player**: Simplified playback controls (Play/Pause, Seek).

## 4. User Flows

### Flow A: Parent Setup

1. Parent signs up.
2. Parent creates a kid profile ("Adam").
3. Parent searches for "Blippi" on the Parent Portal.
4. Parent pins 5 Blippi videos to "Adam".

### Flow B: Child Viewing

1. Child opens the app and selects their profile ("Adam").
2. Child sees the 5 Blippi videos approved by the parent.
3. Child uses the search bar to find "Construction trucks" among the 5 videos.
4. Child watches an approved video.

### Flow C: Shared Management

1. Parent A (Husband) invites Parent B (Wife) to manage "Adam".
2. Parent B accepts the invite.
3. Parent B pins a "National Geographic Kids" video to "Adam".
4. The video appears in Adam's portal immediately.

## 5. Technical Requirements

### 5.1 Technology Stack

- **Unified Framework**: Next.js (App Router) - Handles both Frontend and API.
- **Database**: PostgreSQL (via Drizzle ORM).
- **Styling/UI**: Tailwind CSS + Shadcn/UI.
- **Video Playback**: YouTube IFrame API (Restricted Mode).
- **Real-time Sync**: Pusher (Triggered via Server Actions).

### 5.2 Performance & Reliability

- **Real-time Sync**: Use WebSockets or frequent polling to update the kid's portal when a parent pins a new video.
- **Security**: JWT-based authentication for parents; Profile-based session for kids.

## 6. Future Roadmap

- **Screen Time Limits**: Parents can set daily viewing quotas.
- **Sleep Mode**: Automatically lock the kids portal after a certain hour.
- **Category Tags**: Parents can organize pinned videos into categories (e.g., "Learning", "Shows").
