# SONICLY LISTENER
## Product Requirements Document — V1.0

**Product:** Sonicly Listener  
**Version:** 1.0  
**Product Type:** Full-stack web-based music streaming and discovery platform  
**Primary Users:** Music listeners  
**Current Development Phase:** Listener Platform  
**Future Product:** Sonicly Studio — Artist Portal  
**Status:** Final / Development Source of Truth

---

# 1. Executive Summary

Sonicly Listener is a modern music streaming and discovery platform focused on delivering a polished, immersive listening experience.

The platform allows users to:

- Discover music
- Search for songs, artists, albums, and playlists
- Stream music
- Create and manage playlists
- Like songs
- Follow artists
- Save albums
- Maintain a personal library
- View listening history
- Control playback through a persistent global music player

The initial music catalog will be **static and seeded into PostgreSQL**.

User interaction with that catalog will remain dynamic.

The first version will be built entirely using **JavaScript/TypeScript technologies**.

The application will initially use a **modular monolith architecture** with a deliberately simple infrastructure stack.

The first version will not include AI, real-time collaboration, event queues, caching infrastructure, microservices, or artist-side functionality.

These capabilities may be introduced in later phases after the Listener and Artist products have been independently completed.

---

# 2. Product Vision

Sonicly exists to make listening to music feel:

> **Personal, immersive, effortless, and beautifully connected to the music itself.**

The application should not simply reproduce an existing streaming service.

Sonicly should have its own identity through:

- Strong visual design
- Artwork-focused interfaces
- Fluid interactions
- A persistent listening experience
- Clean music discovery
- A distinctive dark luminous aesthetic

The primary objective of V1 is to create a **convincing, complete music streaming product**.

---

# 3. Product Goals

## G1 — Complete Listener Experience

A user should be able to:

1. Create an account.
2. Discover music.
3. Search the catalog.
4. Open artists and albums.
5. Play music.
6. Build a personal library.
7. Create playlists.
8. Follow artists.
9. Review listening history.
10. Continue listening while navigating the application.

---

## G2 — Distinctive Visual Identity

Sonicly should be immediately recognizable through:

- Dark backgrounds
- Purple/magenta illumination
- The official Sonicly logo
- Waveform-inspired elements
- Artwork-driven layouts
- Smooth animations
- Clean typography

---

## G3 — Demonstrate Full-Stack Engineering

The project should demonstrate practical experience with:

- TypeScript
- React
- Next.js
- Node.js
- NestJS
- REST APIs
- PostgreSQL
- Prisma
- Authentication
- State management
- Audio playback
- Responsive design
- Media handling

---

## G4 — Establish a Strong Foundation

The application should be structured so that future functionality can be added without requiring a complete rewrite.

Future capabilities may include:

- Artist management
- Analytics
- Recommendation systems
- AI-powered discovery
- Real-time listening
- Advanced infrastructure

However, those capabilities are **not part of V1**.

---

# 4. Product Philosophy

Sonicly should not be presented as:

> "A Spotify clone."

The product should instead feel like:

> **An independently designed music streaming and discovery platform.**

The emphasis is on:

- Music
- Discovery
- Personal libraries
- Playlists
- Playback quality
- Visual experience

The interface should remain focused and uncluttered.

---

# 5. Product Scope

## 5.1 Authentication

V1 includes:

- Registration
- Login
- Logout
- Session persistence
- Protected user areas
- Password hashing
- JWT-based authentication

---

## 5.2 Music Catalog

The catalog contains:

- Artists
- Albums
- Songs
- Genres
- Curated playlists

The catalog is initially seeded rather than managed through an artist-facing interface.

---

## 5.3 Discovery

Users can discover music through:

- Home
- Search
- Trending music
- New releases
- Popular artists
- Curated playlists
- Recently played
- Discover Something New

V1 discovery content is curated/static where personalization would otherwise require a recommendation engine.

---

## 5.4 Personal Library

Users can manage:

- Liked songs
- Playlists
- Saved albums
- Followed artists
- Listening history
- Recently played music

---

## 5.5 Music Player

The player supports:

- Play
- Pause
- Previous
- Next
- Seek
- Volume
- Mute
- Shuffle
- Repeat
- Queue
- Progress tracking
- Like current song

The player is persistent throughout application navigation.

---

## 5.6 Playlists

Users can:

- Create playlists
- Rename playlists
- Delete playlists
- Add songs
- Remove songs
- Reorder songs
- Play playlists
- Shuffle playlists

Curated Sonicly playlists cannot be modified by users.

---

## 5.7 Artist Pages

Artist pages contain:

- Artist image
- Artist name
- Verification indicator where applicable
- Monthly listeners
- Follow button
- Popular songs
- Albums
- Singles

---

## 5.8 Album Pages

Album pages contain:

- Artwork
- Album name
- Artist
- Release year
- Track count
- Duration
- Play
- Shuffle
- Save
- Track listing

---

## 5.9 Search

Search supports:

- Songs
- Artists
- Albums
- Playlists

Search categories:

- All
- Songs
- Artists
- Albums
- Playlists

---

# 6. Explicitly Out of Scope for V1

The following are deliberately excluded:

### Artist Platform

- Artist registration
- Artist dashboard
- Artist verification workflow
- Artist uploads
- Album publishing
- Release management
- Artist analytics

### AI

- AI recommendations
- Machine-learning models
- Mood detection
- NLP music search
- AI-generated playlists
- Audio embeddings

### Real-Time Features

- Jamming
- Synchronized playback
- WebSockets
- Collaborative listening
- Real-time social features

### Infrastructure

- RabbitMQ
- Kafka
- Redis
- Microservices
- Kubernetes
- Event-driven architecture

### Social Features

- Messaging
- Comments
- Reactions
- Social feed
- Friend system
- Collaborative playlists

### Commercial Features

- Payments
- Subscriptions
- Advertising
- Premium tiers

### Other Media

- Podcasts
- Live audio
- Video

### Native Applications

- Android
- iOS

---

# 7. Brand Identity

## 7.1 Brand Name

**Sonicly**

The spelling must remain consistent across all interfaces and documentation.

---

# 8. Official Brand Assets

The provided Sonicly logos are the definitive visual identity.

## 8.1 Primary Symbol

The primary symbol is the stylized:

**S + waveform**

It represents:

- Sound
- Rhythm
- Motion
- Music
- Sonic identity

It should be used for:

- Application icon
- Compact branding
- Mobile branding
- Favicon
- Loading mark
- Player branding
- Small-format branding

---

## 8.2 Full Wordmark

The provided **Sonicly** wordmark is the primary full branding asset.

It should be used for:

- Authentication screens
- Desktop application branding
- Splash/loading experiences
- Product landing sections
- About/marketing sections

The official asset should be used instead of recreating the logo as ordinary text.

---

# 9. Brand Personality

Sonicly should feel:

- Modern
- Luminous
- Fluid
- Futuristic
- Musical
- Premium
- Confident
- Personal

It should avoid feeling:

- Corporate
- Sterile
- Generic
- Childish
- Overly neon
- Excessively glassmorphic
- Visually cluttered

The core visual concept is:

> **Sound made physical.**

---

# 10. Visual Design Direction

Sonicly uses a **dark-first luminous interface**.

The base interface remains dark and restrained.

Album artwork provides visual variety.

Purple and pink provide the brand identity.

Subtle lighting and waveform elements provide depth and movement.

The intended visual hierarchy is:

**Dark foundation → Artwork → Brand illumination → Interaction**

---

# 11. Color System

## Primary Background

**Obsidian**

`#08090D`

Used for:

- Main application background
- Full-page backgrounds
- Large visual areas

---

## Navigation Background

**Deep Graphite**

`#0D0E14`

Used for:

- Sidebar
- Navigation
- Structural elements

---

## Surface

**Charcoal**

`#13141B`

Used for:

- Cards
- Panels
- Content surfaces

---

## Elevated Surface

**Light Charcoal**

`#1A1B24`

Used for:

- Hover states
- Dropdowns
- Menus
- Modals
- Elevated player surfaces

---

# 12. Brand Colors

## Sonicly Purple

`#7C3AED`

Primary brand color.

Used for:

- Primary actions
- Active navigation
- Focus states
- Progress indicators
- Selected controls

---

## Bright Purple

`#8B5CF6`

Used for:

- Hover states
- Highlights
- Interactive emphasis

---

## Sonicly Pink

`#D946EF`

Secondary brand color.

Used for:

- Gradient transitions
- Featured elements
- Special highlights

---

## Bright Pink

`#EC4899`

Used sparingly for stronger visual emphasis.

---

## Lavender

`#C4B5FD`

Used for:

- Secondary highlights
- Luminous effects
- Selected states

---

# 13. Secondary Light Accent

The Sonicly wordmark contains a subtle blue/cyan light streak.

This becomes a secondary atmospheric accent.

It may appear in:

- Waveform visualizations
- Special player effects
- Brand animations
- Future audio visualizations

Cyan must not become a primary interface color.

---

# 14. Brand Gradient

Primary Sonicly gradient:

```text id="d1i9fl"
#7C3AED → #D946EF
```

Purple → Pink.

Appropriate uses:

- Primary CTAs
- Player progress
- Featured content
- Hero elements
- Selected visual effects

Gradients should remain restrained.

---

# 15. Waveform Motif

The waveform in the Sonicly logo becomes a recurring visual motif.

Possible uses:

- Player visualization
- Loading states
- Audio indicators
- Empty states
- Future audio analysis

The waveform should not become decorative clutter.

---

# 16. Typography

## Primary Font

**Inter**

Inter is used throughout the application.

---

# 17. Typography Scale

| Element | Size |
|---|---:|
| Display | 56–64px |
| H1 | 36px |
| H2 | 28px |
| H3 | 22px |
| H4 | 18px |
| Body | 15–16px |
| Small | 13–14px |
| Metadata | 12–13px |

---

# 18. Shape Language

Small controls:

`6px`

Cards:

`10px`

Large panels:

`14px`

Artwork:

`10–14px`

Pills:

`999px`

The interface should feel rounded but not excessively soft.

---

# 19. Glow

Glow is reserved for:

- Logo
- Primary actions
- Active player
- Progress indicator
- Featured content
- Waveform elements

Avoid applying glow to every component.

---

# 20. Iconography

Use one consistent icon library.

Preferred:

**Lucide Icons**

Sizing:

- Navigation: 20px
- Secondary controls: 16–18px
- Player controls: 20–24px
- Major controls: 28–32px

Icon-only controls require accessible labels.

---

# 21. Application Layout

Desktop:

```text id="9e2t8w"
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ SIDEBAR             MAIN CONTENT                            │
│                                                             │
│ Sonicly              Search / Header                        │
│                                                             │
│ Home                 ────────────────────────────────        │
│ Search                                                       │
│ Library              Page Content                           │
│                                                             │
│ ─────────────                                                │
│ Liked Songs                                                   │
│ Recently Played                                               │
│                                                             │
│ PLAYLISTS                                                     │
│ Playlist A                                                    │
│ Playlist B                                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     GLOBAL MUSIC PLAYER                      │
└─────────────────────────────────────────────────────────────┘
```

---

# 22. Sidebar

Desktop sidebar is persistent.

## Branding

Full Sonicly wordmark.

## Main Navigation

- Home
- Search
- Your Library

## Library

- Liked Songs
- Recently Played
- Albums
- Artists

## Playlists

User-created playlists.

The playlist area may scroll independently.

---

# 23. Mobile Navigation

On mobile, the sidebar becomes bottom navigation.

```text id="7jtb7m"
┌─────────────────────────────────────┐
│                                     │
│             CONTENT                 │
│                                     │
├─────────────────────────────────────┤
│ Home │ Search │ Library │ Profile  │
└─────────────────────────────────────┘
```

The mini-player appears above the bottom navigation.

---

# 24. Home Page

The Home page is the primary discovery surface.

## Greeting

The greeting changes based on local time:

- Good morning
- Good afternoon
- Good evening

---

## Featured Hero

A large featured album or playlist.

Example:

```text id="8z0b1y"
┌───────────────────────────────────────────────┐
│                                               │
│ FEATURED                                      │
│                                               │
│ Midnight Drives                               │
│ A collection for roads that don't end.       │
│                                               │
│ [ ▶ Play ]   [ + Add to Library ]             │
│                                               │
└───────────────────────────────────────────────┘
```

Artwork should dominate the visual composition.

---

# 25. Home Sections

V1 includes:

### Recently Played

Dynamic based on listening history.

### Made For You

Curated/static content.

### Trending Now

Seeded/curated ranking.

### New Releases

Recently released albums in the static catalog.

### Popular Artists

Curated artist selection.

### Discover Something New

Music the user has not previously played.

---

# 26. Content Cards

## Album Card

```text id="f4e6ub"
┌───────────────┐
│    ARTWORK    │
└───────────────┘
Album Name
Artist Name
```

## Playlist Card

```text id="s2w0ha"
┌───────────────┐
│    ARTWORK    │
└───────────────┘
Playlist Name
Sonicly
```

## Artist Card

```text id="1x6qj5"
       ◯
   Artist Image

   Artist Name
   128K listeners
```

---

# 27. Card Interaction

On hover:

- Artwork scales approximately 2–4%
- Play button appears
- Surface becomes slightly elevated
- Transition lasts approximately 150–250ms

Cards should not dramatically enlarge.

---

# 28. Search

Search supports:

- Songs
- Artists
- Albums
- Playlists

Categories:

- All
- Songs
- Artists
- Albums
- Playlists

Results should be grouped logically.

---

# 29. Artist Page

Artist page contains:

- Artist image
- Artist name
- Verification indicator where applicable
- Monthly listeners
- Follow button
- Popular tracks
- Albums
- Singles

Example:

```text id="qg2txj"
The Midnight
1.2M monthly listeners

[ Follow ]

Popular

01 Sunset
02 Los Angeles
03 Days of Thunder

Albums

[Album] [Album] [Album]

Singles

[Single] [Single]
```

---

# 30. Album Page

Album page contains:

- Artwork
- Album name
- Artist
- Release year
- Track count
- Total duration
- Play
- Shuffle
- Save
- Track listing

Clicking a track begins playback.

---

# 31. Playlist Page

Playlist page contains:

- Playlist artwork
- Name
- Creator
- Description
- Track count
- Total duration
- Play
- Shuffle
- More options
- Track list

User-created playlists are editable.

Curated playlists are not.

---

# 32. Library

Library sections:

- Playlists
- Songs
- Albums
- Artists

Sorting:

- Recently added
- Recently played
- Alphabetical

Default section:

**Playlists**

---

# 33. Liked Songs

Liked Songs is a system-generated playlist.

Users can:

- Play all
- Shuffle
- Search
- Unlike

The collection itself cannot be deleted.

---

# 34. Global Music Player

The music player is one of the primary components of Sonicly.

It is persistent across application navigation.

---

# 35. Desktop Player

```text id="1p7saz"
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│ [ART] Midnight Drive    ◀   ▶   ▶       ───────●────       │
│       Artist Name                         2:31 / 4:12       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Controls:

- Previous
- Play/Pause
- Next
- Seek
- Volume
- Queue
- Shuffle
- Repeat
- Like

---

# 36. Mobile Player

Mobile uses:

**Mini Player → Full Player**

Mini player:

```text id="cz5m4g"
[Cover] Song Name
        Artist              ▶
```

The full player emphasizes album artwork.

---

# 37. Full Player

The full player should provide:

- Large artwork
- Song title
- Artist
- Progress
- Duration
- Playback controls
- Shuffle
- Repeat
- Like
- Queue access

The design should use subtle Sonicly lighting rather than excessive effects.

---

# 38. Player State

Global player state contains:

```text id="j2w8g7"
currentTrack
queue
isPlaying
currentTime
duration
volume
shuffle
repeatMode
```

Player state is independent from individual pages.

---

# 39. Queue

Queue contains:

### Now Playing

Current track.

### Next Up

Upcoming tracks.

Users can:

- Reorder
- Remove
- Clear
- Add songs
- Play immediately

---

# 40. Playback Behavior

When selecting a song:

1. Set current track.
2. Update queue.
3. Start playback.
4. Update global state.
5. Record playback activity.

When a song ends:

1. Check repeat mode.
2. Repeat if Repeat One.
3. Otherwise advance.
4. Apply shuffle if enabled.
5. Continue playback.

---

# 41. Shuffle

Shuffle randomizes the remaining queue.

The current track remains unchanged when shuffle is enabled.

---

# 42. Repeat

Three states:

- Off
- Repeat All
- Repeat One

The active state must be visually distinguishable.

---

# 43. Authentication UX

## Login

Fields:

- Email
- Password

Actions:

- Log In
- Create Account

## Registration

Fields:

- Username
- Email
- Password
- Confirm Password

Action:

- Create Account

Authentication pages should prominently use the Sonicly branding.

---

# 44. User Profile

Profile contains:

- Display name
- Username
- Email
- Profile image
- Account creation date
- Logout

Advanced settings are deferred.

---

# 45. Static Music Catalog

The initial catalog will be seeded.

Target:

- 20+ artists
- 40+ albums
- 200+ songs
- 10+ genres
- 15+ curated playlists

The catalog should contain enough content to make browsing meaningful.

---

# 46. Dynamic User Data

The following remain dynamic:

- Users
- Likes
- Follows
- Playlists
- Playlist contents
- Listening history
- Recently played
- Profile information

This allows Sonicly to behave like a real application even though the catalog itself is static.

---

# 47. Database Entities

V1 entities:

```text id="k7b1cu"
User
Artist
Album
Song
Genre
Playlist
PlaylistSong
Like
Follow
ListeningHistory
```

---

# 48. Database Relationships

```text id="j4s3qf"
Artist
 └── Albums
      └── Songs

User
 ├── Likes → Songs
 ├── Follows → Artists
 ├── Playlists
 └── ListeningHistory → Songs

Playlist
 └── PlaylistSongs → Songs
```

---

# 49. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand

## Backend

- Node.js
- NestJS
- TypeScript

## Database

- PostgreSQL

## ORM

- Prisma

## Development

- Docker
- Docker Compose
- Git

---

# 50. V1 Infrastructure

The initial architecture is intentionally simple:

```text id="z9oxr3"
                 Next.js
                    │
                    ▼
                 NestJS
                    │
                  Prisma
                    │
                    ▼
               PostgreSQL
```

No:

- Redis
- RabbitMQ
- Kafka
- WebSockets
- Microservices
- Kubernetes

---

# 51. Backend Architecture

V1 uses a modular monolith.

NestJS modules:

```text id="2qf3rj"
auth
users
artists
albums
songs
genres
playlists
library
history
search
```

Each module must have a clearly defined responsibility.

The architecture should remain extensible without prematurely splitting into microservices.

---

# 52. API Design

Representative endpoints:

```text id="n8b1f5"
POST   /auth/register
POST   /auth/login
POST   /auth/logout

GET    /artists
GET    /artists/:id

GET    /albums
GET    /albums/:id

GET    /songs
GET    /songs/:id

GET    /search?q=

GET    /playlists
POST   /playlists
GET    /playlists/:id
PATCH  /playlists/:id
DELETE /playlists/:id

POST   /songs/:id/like
DELETE /songs/:id/like

POST   /artists/:id/follow
DELETE /artists/:id/follow

GET    /history
POST   /history
```

The final API contract will be established during backend implementation.

---

# 53. State Management

Zustand will manage appropriate client-side global state.

The music player will maintain:

```text id="8e7j1p"
currentTrack
queue
isPlaying
currentTime
duration
volume
shuffle
repeatMode
```

Server data and player state should remain conceptually separate.

---

# 54. Media Architecture

Audio should not be stored directly inside PostgreSQL.

The database stores references such as:

```text id="2h9jca"
audio_url
cover_url
```

Actual media should eventually be stored using object storage.

During local development, local files may be used behind a storage abstraction.

---

# 55. Audio Playback

The browser audio layer provides initial playback.

Audio logic should be isolated from UI components.

This allows future improvements to streaming or media processing without redesigning the interface.

---

# 56. Loading States

Skeleton states are required for:

- Album cards
- Artist cards
- Song rows
- Home sections
- Search results
- Artist pages
- Album pages
- Playlist pages

Blank screens should be avoided during loading.

---

# 57. Empty States

Every collection requires an intentional empty state.

## Empty Playlist

> Your playlist is empty.

> Find something you love and add it here.

**[ Explore Music ]**

## Empty Liked Songs

> Nothing here yet.

> Like songs while you listen and they'll appear here.

---

# 58. Error States

Errors should be human-readable.

Instead of:

> HTTP 500

Use:

> Something went wrong.

> We couldn't load this right now.

**[ Try Again ]**

---

# 59. Toast Notifications

Examples:

- Added to Liked Songs
- Removed from Liked Songs
- Added to playlist
- Playlist created
- Artist followed
- Artist unfollowed
- Playlist updated

---

# 60. Interaction Design

Standard transitions:

**150–250ms**

Used for:

- Hover
- Buttons
- Cards
- Menus
- Player expansion
- Selection states
- Navigation

Animations should enhance usability rather than distract from the listening experience.

---

# 61. Keyboard Controls

V1:

| Key | Action |
|---|---|
| Space | Play/Pause |
| ← | Seek backward |
| → | Seek forward |
| M | Mute |
| N | Next |
| P | Previous |

Shortcuts must not activate while typing in input fields.

---

# 62. Responsive Design

## Desktop

`≥ 1200px`

- Persistent sidebar
- Large content grids
- Full player

## Tablet

`768px–1199px`

- Reduced sidebar
- Adaptive grids
- Compact/full player depending on available space

## Mobile

`< 768px`

- Bottom navigation
- Mini-player
- Full-screen player
- Adaptive content layouts

---

# 63. Accessibility

The application must support:

- Keyboard navigation
- Visible focus states
- Semantic buttons
- ARIA labels
- Accessible player controls
- Adequate color contrast
- Alternative text
- Screen-reader-friendly navigation

---

# 64. Security

V1 must include:

- Password hashing
- JWT authentication
- Protected API routes
- Authorization checks
- Input validation
- CORS configuration
- Secure HTTP headers
- Environment variables for secrets
- No secrets committed to source control

Users may only modify their own:

- Profile
- Playlists
- Likes
- Follows

---

# 65. Performance

The application should prioritize:

- Fast initial rendering
- Optimized artwork
- Lazy loading
- Efficient API requests
- Pagination
- Efficient database queries
- Minimal unnecessary React renders
- Persistent player state

Music playback must not be interrupted simply because the user navigates between pages.

---

# 66. Future Expansion

The Listener platform will eventually become one part of the larger Sonicly ecosystem.

The planned progression is:

```text id="f7c8z1"
Sonicly Listener
       │
       ▼
Sonicly Studio
       │
       ▼
Advanced Infrastructure
       │
       ▼
Jamming
       │
       ▼
AI / Recommendations
```

Each stage will be designed independently when its development begins.

---

# 67. Future Sonicly Studio

The Artist Portal will eventually provide:

- Artist accounts
- Artist verification
- Artist profiles
- Song uploads
- Album creation
- Release management
- Artwork management
- Audio processing
- Publishing
- Stream analytics
- Audience analytics
- Performance reports

The Listener catalog is deliberately designed so that artist ownership can be introduced later.

---

# 68. Future Advanced Infrastructure

Later versions may introduce:

### Redis

For:

- Caching
- Sessions
- Frequently accessed data
- Rate limiting

### RabbitMQ

For:

- Asynchronous processing
- Analytics events
- Media processing
- Notifications

### AI

For:

- Personalized recommendations
- Natural-language discovery
- Mood-based discovery
- Audio analysis

These technologies are explicitly excluded from V1.

---

# 69. Future Jamming

Jamming is intentionally deferred until after the Listener and Artist platforms have been developed.

It will be treated as a separate engineering project involving:

- WebSockets
- Real-time state
- Playback synchronization
- Shared queues
- Participant management

No Jam-specific database tables, APIs, UI, or architecture should be implemented in V1.

---

# 70. Development Phases

## Phase 0 — Product & Design

Finalize:

- Brand identity
- Colors
- Typography
- Navigation
- Screen designs
- Player design
- Component system
- Responsive behavior

---

## Phase 1 — Project Foundation

Implement:

- Monorepo
- Next.js
- NestJS
- PostgreSQL
- Prisma
- Docker
- Environment configuration

---

## Phase 2 — Database

Implement:

- Prisma schema
- Relationships
- Migrations
- Seed scripts
- Static music catalog

---

## Phase 3 — Backend

Implement:

- Authentication
- Users
- Artists
- Albums
- Songs
- Genres
- Search
- Playlists
- Likes
- Follows
- History

---

## Phase 4 — Frontend

Implement:

- Application shell
- Sidebar
- Navigation
- Home
- Search
- Artist pages
- Album pages
- Playlist pages
- Library
- Profile

---

## Phase 5 — Music Player

Implement:

- Audio engine
- Global player
- Queue
- Play/Pause
- Previous/Next
- Seek
- Volume
- Shuffle
- Repeat
- Progress
- Mobile player

---

## Phase 6 — User Features

Implement:

- Likes
- Playlists
- Follows
- Listening history
- Recently played
- Saved albums

---

## Phase 7 — Polish

Implement:

- Responsive layouts
- Skeleton loading
- Empty states
- Error states
- Toasts
- Animations
- Accessibility
- Keyboard shortcuts

---

## Phase 8 — Deployment

Implement:

- Production builds
- Database deployment
- Backend deployment
- Frontend deployment
- Media hosting
- Environment management
- Basic monitoring

---

# 71. V1 Definition of Done

Sonicly Listener V1 is complete when a user can:

### Account

1. Create an account.
2. Log in.
3. Log out.
4. Maintain an authenticated session.

### Discovery

5. Browse the home page.
6. Search for songs.
7. Search for artists.
8. Search for albums.
9. Search for playlists.
10. Open artist pages.
11. Open album pages.
12. Browse curated playlists.

### Listening

13. Play a song.
14. Pause a song.
15. Skip tracks.
16. Seek through a song.
17. Adjust volume.
18. Shuffle.
19. Repeat.
20. View the queue.
21. Modify the queue.
22. Continue playback while navigating.

### Library

23. Like songs.
24. Unlike songs.
25. Create playlists.
26. Edit playlists.
27. Add songs to playlists.
28. Remove songs from playlists.
29. Follow artists.
30. Save albums.
31. View listening history.
32. View recently played music.
33. Browse saved content.

### UX

34. Use the application on desktop.
35. Use the application on mobile.
36. Receive loading states.
37. Receive empty states.
38. Receive useful errors.
39. Experience consistent Sonicly branding.

---

# 72. Success Criteria

Sonicly Listener V1 should succeed across five dimensions.

## Product Quality

The application should feel like a complete music product rather than a collection of pages.

## User Experience

A user should be able to discover, play, organize, and return to music naturally.

## Engineering Quality

The project should demonstrate genuine full-stack development with:

- Frontend
- Backend
- Database
- Authentication
- API architecture
- Media handling

## Visual Identity

The application should immediately feel like Sonicly.

## Extensibility

The system should be capable of evolving toward the Artist Portal and later advanced features without requiring a complete rewrite.

---

# 73. Visual North Star

Sonicly should feel like:

> **A dark canvas illuminated by music.**

The interface remains calm.

Album artwork provides visual variety.

Purple and pink provide the Sonicly identity.

The waveform provides the recurring visual motif.

Subtle glow provides depth.

Smooth transitions provide motion.

Typography provides structure.

The user should always be able to answer four questions immediately:

**What am I listening to?**

**What can I play next?**

**Where can I discover something new?**

**Where is my music?**

---

# 74. Final Product Definition

**Sonicly Listener V1 is a full-stack music streaming, discovery, and personal library platform.**

It combines:

- Music discovery
- Search
- Artist browsing
- Album browsing
- Music streaming
- Persistent playback
- Playlists
- Likes
- Artist following
- Saved albums
- Listening history
- Responsive design

with a distinctive dark, luminous visual identity derived from the official Sonicly branding.

The catalog is initially static.

User interaction is dynamic.

The backend is a modular NestJS monolith.

The database is PostgreSQL.

The frontend is Next.js/React with TypeScript.

The application is intentionally free of unnecessary infrastructure during V1.

---

# 75. Guiding Engineering Principle

The project follows one central rule:

> **Build complexity because the product requires it, not because the technology sounds impressive.**

V1 therefore begins with:

**Next.js + TypeScript**

↓

**NestJS + TypeScript**

↓

**Prisma**

↓

**PostgreSQL**

with local/static media initially.

No:

**Redis**

**RabbitMQ**

**Kafka**

**WebSockets**

**AI**

**Microservices**

**Artist Portal**

are required for the first version.

The first milestone is deliberately simple:

> **Build Sonicly Listener into a polished, functional music streaming product that feels like a real application.**

Only after that product is complete will we move to:

**Sonicly Studio → Jamming → Advanced Infrastructure → AI.**