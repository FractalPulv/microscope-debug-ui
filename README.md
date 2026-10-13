# Microscope Debug Application

A small version of the Debug Application. You can search for an attribute, see its value
and change it on the machine. Nothing is hardcoded: whatever modules and attributes the API
returns is what you get on screen.

## Running it

1. Start the dummy API from its folder: `node src/server.js` (runs on `http://localhost:8080`)
2. Here: `bun install`, then `bun run dev`, and open `http://localhost:5173`

If the API is somewhere else, set `VITE_API_URL` (see `.env.example`).

## Stack

- React, because it's what I usually use. It's my bread and butter on the web and on mobile with React Native.
- TanStack Query, because it's pretty much the standard for talking to an API now. Caching, refetching and loading/error states come for free.
- Tailwind, because it's easy, I don't have to dig through stylesheets, and it's what I'm familiar with.

## What it does so far

- Shows every module with its attributes and properties, straight from `GET /`
- Search (case-insensitive) over module, name, label and description. `/` jumps to the search box
- Editing read-write attributes, with an input that matches the type: dropdown for allowed values, number field with min/max, checkbox for booleans
- Checks the value before sending it, so you see "above the maximum of 20000" instead of a plain `FAIL`
- Reads the response text, not just the status. The API returns 200 for `FAIL` too
- Re-reads the value from the machine after a write instead of assuming it worked
- Raw JSON of the whole index, and the raw request/response of each write, for debugging
- Collapsible modules and groups, expand/collapse all
- Auto-refresh every 2, 5 or 10 seconds, with a "last updated" time

## How it's set up

```
api/raw.ts      the API's shapes, exactly as they come in
api/mapper.ts   converts those into my own types
model.ts        my own types (Module, Attribute, Property)
api/client.ts   the HTTP calls
api/queries.ts  TanStack Query hooks
components/     the UI
```

The API isn't consistent (attributes use `attributeName`/`value`, properties use
`_name`/`_value`) and it changes between firmware versions. So everything gets converted
in one place, the mapper. If the firmware changes, that's the file to update, not every component.

A few other things to deal with different firmware:

- Unknown data types still show up, but read-only
- Anything that isn't `READWRITE` is treated as read-only
- If an attribute was renamed or removed, you get the API's error message

## What I'd do next

1. Fetch and poll single attributes instead of the whole index, and only the ones on screen
2. Tests for the mapper, the validation and the SUCCESS/FAIL handling
3. Commands as buttons, with progress (e.g. PumpDown watching `vacuum_status_progress`), plus a confirm step for risky ones like `enableHT`
4. Editing properties, also with a confirm step since they're calibration values
5. With ~100x more attributes in the real thing: a virtualized list, search and filters in the URL so you can share a view, and pinning the attributes/props you're watching while debugging
6. Better search: filter on a single field, highlight matches

## Things I left out

- No tests, to stay within the time
- Search is plain substring, not fuzzy. People usually know part of the name, and fuzzy on short queries gives too many results
- Auto-refresh and writes reload the whole index. Fine for the sample, too heavy for the real API
