# JavaScript-RemoteURLOpener
We here at [Iconduck](https://iconduck.com/?ref=github.com) take opening URLs
very seriously. And also, we're lazy.

I ([@onassar](https://github.com/onassar)) got super tired of having to define `target="_blank"` on
links, as well as adding query params like `?ref=iconduck.com` at the end of
anchor `href` values.

So, I built a nice little, creatively named, library called
`JavaScript-RemoteURLOpener`.

The goal is to have it do exactly what the name suggests: manage the opening of
remote URLs.

To that end, it does the following:
- Compare the `hostname` of any link on a page, and if it's not in the
`config.validHostnames` array, open it in a new tab or window.
- Exclude `mailto` links from this logic
- Exclude any elements that have a class name value in the
`config.ignoreClassNames` array
- Expose a `setRef` method that when a value is passed in, will ensure that the
following URL param gets appended to all outbound links: `?ref=website.com`

That's it for now, but I'll likely add in some extra options to do a better
job at handling `mailto` cases (specifically, dealing with the `subject` and
`body` URL params).

### Usage
Usage is very simple:

``` javascript
RemoteURLOpener.init();
RemoteURLOpener.setRef('iconduck.com');
```

Make sure you run this after the DOM has loaded. It'll simply add a click event
listener on any applicable links and run a `window.open` call against the `href`
value.

### TODO
- Add support for elements that are added to the DOM after the initial `init`
call. This is super-important for Single Page Apps (SPAs).
