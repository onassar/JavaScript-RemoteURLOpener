# JavaScript-RemoteURLOpener
We here at [Iconduck](https://iconduck.com/?ref=github.com) take opening URLs
very seriously. And also, we're lazy.

I (@onassar) got super tired of having to define `target="_blank"` on
links, as well as adding query params like `?ref=iconduck.com` at the end of
anchor `href` values.

So, I built a nice little, creatively named, library called
`JavaScript-RemoteURLOpener`.

The goal is to have it do exactly what the name suggests: manage the opening of
remote URLs.

To that end, it does the following:
- Compare the `hostname` of any link on a page, and if it's no in the
`config.validHostnames` array, open it in a new tab or window.
- Exclude `mailto` links from this logic
- Expose a `setRef` method that when a value is passed in, will ensure that the
following URL param gets appended to all outbound links: `?ref=website.com`
- 

That's it for now, but I'll likely add in some extra options to do a better
job at handling `mailto` cases (specifically, dealing with the `subject` and
`body` URL params).

### Usage
Usage is very simple:

``` javascript
RemoteURLOpener.init();
RemoteURLOpener.setRef('iconduck.com');
```