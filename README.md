# Microscope Debug Application

A small rebuild of the Debug Application. A technician can look up an attribute, see its
current value and change it on the machine. The UI builds itself from whatever the Debug
API returns, so there are no module or attribute names in the code.

## Running it

1. Start the dummy API from its own folder with `node src/server.js`. It listens on `http://localhost:8080`.
2. In this folder, run `bun install` and then `bun run dev`, and open `http://localhost:5173`.

To talk to a different machine, set `VITE_API_URL` (see `.env.example`).

Stack: React, TypeScript and Vite, with TanStack Query for server state and Tailwind for styling.

## What this version does

- Loads the index (`GET /`) and shows each module with its attributes and properties.
- Search matches module, name, label and description. It ignores case, and every word you
  type has to match somewhere, so `gun volt` finds `voltage_accelerator`. Press `/` to jump to the search box.
- Read-write attributes get an input that fits their schema: a select when there are
  allowed values, a number field with the min and max, a checkbox for booleans, and a text field for everything else.
- Values are checked against the schema before anything is sent. If 25000 is over the
  maximum, the user is told that, instead of getting a bare `FAIL` back from the machine.
- The API answers HTTP 200 even when a write fails, so the app looks at the body and only
  treats `SUCCESS` as success. After a write it reads the value back from the machine
  rather than assuming it stuck.
- The raw index response and the raw request/response of each write are one click away, for debugging.
- Modules and their attribute/property groups collapse, and there are expand all / collapse all buttons.
- Auto-refresh can re-read everything every 2, 5 or 10 seconds, and the header shows when the data was last updated. Polling pauses while the tab is in the background.

## Plan for the full rebuild

### Principles

The API is the source of truth. The UI shows whatever the connected firmware exposes, and
a new attribute should show up without anyone touching the code.

This is a tool for technicians. Finding the right attribute quickly and knowing what the
machine actually did matter more than how it looks.

The clean view is the default, but the raw data the machine sent is always available.
When something is off, that's the first thing a firmware developer will want to see.

### Structure

```
api/raw.ts      shapes exactly as the API returns them
api/mapper.ts   raw → app model (the only place that knows the wire format)
model.ts        the app's own types: Module, Attribute, Property, Command
api/client.ts   HTTP calls, SUCCESS/FAIL parsing
api/queries.ts  TanStack Query hooks (reads, writes, cache invalidation)
components/     UI, only ever sees the app model
```

The mapper is the decision I'd defend first. The API isn't consistent with itself
(attributes use `attributeName` and `value`, properties use `_name` and `_value`), and it
changes between firmware versions. Converting everything at the edge means a firmware
change touches one file instead of every component.

### Coping with different firmware versions

- Names are taken from the list keys, because that's what goes in the URL, not from the fields inside each object.
- A data type the app doesn't know is still shown, but read-only, so a new type can't break the page.
- Anything that isn't explicitly `READWRITE` is treated as read-only.
- A missing list (`property_list` and so on) counts as empty.
- If an attribute was renamed or removed, the API answers with a 4xx and the app shows its error message.
- Still to do: validate the raw response at runtime (zod, for example), warn clearly when
  the shape is unexpected, and show which firmware version is connected.

### Properties and commands

Properties follow the same pattern as attributes. Their mapper already exists, and they
can reuse the same editor. They hold calibration values, though, so writing one should
ask for confirmation first.

Each command becomes a button. A `SUCCESS` only means the sequence started, so after
triggering one the UI should poll the related state attributes (`vacuum_state`,
`vacuum_status_progress`) and show progress. Commands that can do damage, like `enableHT`,
should also ask for confirmation.

### Freshness and concurrency

The machine changes values on its own, so the screen has to keep up. Right now
auto-refresh re-reads the whole index on a timer. In the full app it should only poll the
live, read-only attributes that are on screen.

Responses take anywhere from 0 to 2 seconds and can come back out of order. TanStack Query
keeps the latest result per query key, and after a write the app re-reads instead of
trusting the value it sent. Later on, per-attribute queries (`/{module}/attribute/{name}`)
should replace re-fetching the whole index.

Only one write per attribute can be in flight; the Set button is disabled until the current one finishes.

### Scale

The sample is roughly 1% of the real API, so the real thing will have hundreds of attributes. That means:

- virtualizing long lists
- keeping search on the client, over the loaded index, which is still fast at that size
- putting search, filters and open sections in the URL so a technician can send someone a link to a view
- letting people pin the handful of attributes/props they watch during calibration or during general debugging sessions

## Trade-offs in this version

- I didn't write automated tests in the two hours. The first ones would cover the mapper,
  the validation and the SUCCESS/FAIL parsing. Those are pure functions and they're where the bugs would hide.
- Search is substring matching, not fuzzy. Attribute names are technical and people usually
  know part of them.
- Auto-refresh re-reads the whole index. That's fine for the sample, but too heavy at the real API's size.
- A write re-fetches the whole index. It's simple and correct for now, and per-attribute queries come next.

## Next steps, in order

1. Switch to per-attribute queries, and poll only the live attributes on screen.
2. Unit tests for the mapper, validation and API client.
3. Commands with progress tracking, and editing properties.
4. Runtime validation of the API response, plus a firmware version indicator.
5. Virtualized list, state in the URL, pinned attributes/props.
6. Search refinements: filtering by a single field (name, value, description) and highlighting matches.
