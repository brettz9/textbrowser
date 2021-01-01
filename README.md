# TextBrowser

*Please note that this project, while now preliminarily functional,
is in its early stages. There are some bugs to iron out such as
with localization.*

*TextBrowser* supports power-user browsing of arbitrary multi-linear
texts following the "offline first" motto.

The splash page for the texts is an internationalized interface
that allows for selection by the user of their desired interface language,
followed by a screen to choose from among designated texts, with each text
being given its own page to allow browsing of the contents of the text.

The text interface offers fine grained control to the *user* for how they
wish the output of that text to be displayed, both in terms of styling and
positioning, with its features particularly shining with multilinear/parallel
texts (e.g., multiple translations or commentaries that one views
side-by-side), allowing columns to be displayed in separated columns and/or
interlinearly (one verse vertically beneath the corresponding alternate).

Despite the name of the project referring to "text", this project
can be used for browsing any tabular data with sequential items.

It is designed to run solely with client-side JavaScript with the intent
that the web software will be able to work fully offline in the browser
as well as online. Currently, it must be run on a server though any static
server will do (it comes with a script to run the code on a simple Node.js
static file server--which can be easily set up on a local machine as well).
(It can't be run from a `file://` URL (at least in Chrome), however, due to
more recent browser-added file access restrictions in such an environment.)

The syntax used in the code currently only works in a modern browser and
to date has only been tested in Chrome.

## Features / Design Goals

The following are user-facing features/goals:

-  Have the interface be fully internationalized (i18n) to support translation
    into other languages and well localized (l10n) into such languages,
    including for right-to-left languages. Internationalization even
    optionally applies to parameter names, though this functionality
    (and some other i18n features in general are not thoroughly tested at
    present).
-  Allow texts to be grouped on a work selection page with separate
    introductory messages for each work.
-  Allow browsing by a range of verses
-  Allow browsing by alternate mechanisms (e.g., by different ordering schemes
    on the same text)
-  Allow precise and canonical pointing to a specific row or even cell
    within a work (designation of anchors) by graphical means (without the
    user needing to dig through HTML).
-  Provide enumerated choices as pull-downs and numeric choices within
    numerically-aware input fields (including for max and min values).
-  Ability to selectively disable any column
-  Ability to reorder (and even repeat) columns
-  In addition to parallel text functionality where different translations,
    commentaries, etc. are assigned their own separate columns in the results
    table, allow users to designate that any field have any other field(s)
    repeating within its cell (i.e., interlinear as opposed to parallel
    display). Also provides a styling option on whether to repeat column
    names and the option to style them (currently, the administrator can
    also choose exactly how to separate these within cells from one another,
    but we hope to provide user-facing preselected choices in the future).
-  Allow categorization of content by language so that users can quickly
    enable only such content languages in which they are interested
-  Allow user to not only bookmark/share links of the results page and even
    of a particular view of the work page. Functionality should be
    available as much as possible via URL parameters.
-  Allow column-specific styling
-  Allow generic page styling of text, as form controls or CSS for
    experienced users.
-  Allow fine-grained control of the table display beyond border styling
    (e.g., whether to show a caption summarizing the work/selection, whether
    to show a header and if so, whether it should be fixed and/or styled, or
    or whether the "table" is even an HTML table or instead HTML `<div>`'s,
    etc.--JSON export is hoped for the future).
-  Ease of navigation within a site (as via breadcrumbs) and accessibility
    (e.g., for the visually impaired) is also desired, but we are hoping
    for expertise to provide a review and ideally assistance. We do have
    some code begun internally.

The following are administrator-facing features/goals:

-  Allow most functionality to work for administrators out of the box via a
    declarative style (via well-used and readable JSON files) without need
    for custom scripting. Though the project originated to meet the need of
    Bahá'í texts, any document and even data with sequential fields
    that can be put into a tabular structure can be browsed.
-  Allow for translations within separate locale files
-  Allows for easy conversion of table structures (e.g., SQL, JSON) into our
    simple JSON array format
-  Allow for standard means (as with our use of
    [JSON Schema](http://json-schema.org/documentation.html))
    to designate type information that can be used by the program for
    automated display as well as optimization. Where a standard means
    does not exist, we provide a declarative meta-data file to house
    this information.
-  It is a goal for us to support plug-ins for extensibility, including
    declarative specification without need for scripting, but such support
    is currently lacking (though some work internally has begun).
-  It is a goal for us to support declarative means for indicating site
    hierarchy and navigation. This is not implemented, but we do have some
    code begun internally.

The following are third-party-site-facing features/goals:

-  The thorough use of query strings (even to customize the work selection
    page as well as the results page) allow for other tools to more easily
    tap into our API, and the control of styling (including of whether to show
    table headers) deliberately allows for third-party sites to embed
    content directly from *TextBrowser*-driven sites (including sites which
    might wish to provide up-to-date, proofread, canonical sources of data
    without duplicating or introducing the possibility of copy-paste error).
    Blogs, discussion forums, and wikis might, for example, provide widgets
    (a popup to our site especially once we may have implemented our to-do
    for canonical syntax selection available through `postMessage`?) which
    could be used to embed a specific range and/or styling of text in a post.
    These advantages of widely-used query strings also go for people sharing
    links or bookmarking for themselves.

The following are *TextBrowser*-developer-facing features/goals:

-  Strong separation of concerns, with "design logic" separate from
    "business logic". We are using [Jamilih](https://github.com/brettz9/jamilih)-based
    templating to allow for templating functions in Vanilla JavaScript (as
    well as avoiding ugly, angular HTML almost entirely!). While the results
    display for users leverages CSS classes, we still need to remove some
    inline styling for better structural (HTML) vs. styling (CSS) separation.
-  We aim to leverage modern syntax, especially JavaScript, allowing
    derivative projects to polyfill if they wish to support older browsers.
    Besides aiming for better forward-compatibility, this allows us to use
    standard, well-known patterns, as well as more readable, succinct code.
-  We hope for good test-driven development, but currently this is limited to
    schema validation. We are still in need of a choice of UI testing
    framework and tests (as well as for unit tests).

## Installation

The repository is intended to be used as a
[npm](https://www.npmjs.com/) dependency.

Run the following from your project root.

```install
npm install textbrowser --save
```

You can also target the latest code in `master` with the following:

```json
"dependencies": {
    "textbrowser": "git@github.com:brettz9/textbrowser.git#master"
}
```

And then run `npm install` on your project path.

(To update, you can remove `node_modules/textbrowser/` from your project
and reinstall.)

## Usage

The following instructions are aimed at those adding *TextBrowser* as a
dependency of their own project.

If you would like to see a sample package implementing the
following, see the
[bahaiwritings](https://bitbucket.org/brettz9/bahaiwritings)
project.

Projects derivative to *TextBrowser* will need to adhere to the following:

1.  Add the *TextBrowser* dependency per the [Installation](#Installation)
    section.

1.  Prepare JSON data files, JSON Schema files, and JSON meta-data files
    to represent your texts. See the section
    [JSON Formats](#JSON Formats).
    To provide a common naming mechanism across projects and to avoid
    the need to tweak the default `TextBrowser` JavaScript class set-up, a
    [specific directory structure](#Recommended Project Directory Structure)
    is recommended for hosting these files.

1.  Prepare JSON files to indicate the specific grouping of files you wish
    to make available and optionally the interface languages you wish to
    make available (and for which you have locales), and after it may be
    ready, and if you wish, the JSON files to indicate your site hierarchy.
    See the
    [recommended directory structure](#Recommended Project Directory Structure)
    section for more.

1.  Create an HTML page (see `index-sample.html` for an example) which includes
    *TextBrowser*'s own project scripts and your own script to instantiate
    the `TextBrowser` class (and if you did not follow the
    [recommended directory structure](#Recommended Project Directory Structure),
    you will need to point to the above-mentioned JSON
    files). Page titles are set dynamically for each page, so there is no
    need to provide a `<title>`.

## Recommended Project Directory Structure

The recommended project directory structure (which are used by default by the
`TextBrowser` JavaScript API) is as follows:

-   ***package.json*** - Should indicate `textbrowser` as a dependency as per
    the [Installation](#Installation) section above.
-   ***node_modules*** - *TextBrowser* and its dependencies will be
    added here via npm install as well as any dependencies you indicate
    within `package.json`.
-   ***index.html*** - The main application code. One can use
    `index-sample.html` as is or modified as desired. Note that it
    may be sufficient to modify `resources/user.css` and `resources/user.js`.
-   ***resources/user.css*** - Add any custom CSS you wish to apply
    for `index.html`. (This convention allows you to get custom styling
    without modifying the sample index file.)
-   ***resources/user.js*** - Add any JavaScript you wish to use. (This
    convention allows you to get custom styling without modifying the
    sample index file.) Unless already invoked in `index.html`, you should
    call the `TextBrowser` constructor here. See *TextBrowser*'s
    `resources/user-sample.js` for a pattern you can copy and optionally
    adapt.
-   ***resources/user.json*** - Indicates meta-data for consumption by
    service worker
-   ***plugins/*** - While *not yet in use*, this is the convention we wish
    to begin enforcing for hosting plugins (e.g., for automated columns).
    See [Plugin Format](#Plugin Format).
-   ***sw.js*** - Although you can change the name of this file via
    `serviceWorkerPath` (see [JavaScript API](#JavaScript API)), this
    file should be at or higher than the files you are caching (including
    *TextBrowser*'s). Copying `sw-sample.js` as `sw.js` at your project
    root is the recommended approach.
-   ***data/*** - Directory recommended as a convention for holding JSON data
    files. It is also recommended that child directories be named for each
    file group, and within each file group, have the JSON data files
    as well as "schema" and "metadata" subdirectories containing the
    specific JSON schemas for each data file and the
    *TextBrowser*-specific meta-data files. See [JSON Formats](#JSON Formats).
-   ***files.json*** - See [JSON Formats](#JSON Formats).
-   ***site.json*** - See [JSON Formats](#JSON Formats).
-   ***locales/*** - Only needed if providing an alternate to *TextBrowser*'s
    own built-in `locales/`. It is recommended to rely on the default
    files and not add any custom files (contributing back here any
    localization fixes or additions you may have done!). See
    [JSON Formats](#JSON Formats).
-   ***languages.json*** - As with `locales/`, only needed if providing an
    alternate to *TextBrowser*'s own built-in `appdata/languages.json` file.
    It is recommended to rely on the default and not add any custom file. See
    [JSON Formats](#JSON Formats).

## JSON Formats

The sections below begin with where you can find the JSON schema which
defines the format and an example file. They then follow with a
plain language description of the format.

One meta-property shared among `files.json` and metadata files is
`localeKey` which is a non-standard means of pointing to a key
for substitution. It may be replaced in the future by the slightly
more cumbersome though standards-track
[JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)s.

### Work-Specific JSON

JSON data files, the individual JSON schema file against which the data
file can be validated (and enhanced in a standard manner with type
information), and our custom JSON metadata format file for indicating
information such as designating fields for browsing ranges, are covered
in this section.

#### JSON Data

JSON data files to represent your data (e.g.,
[this file](https://bitbucket.org/brettz9/bahaiwritings/src/6b07fb41d11ed76570f7da03ffc9d11aa8ff0a5d/data/writings/peace.json?at=master&fileviewer=file-view-default))
expect 3 fields (per the simple
[schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/table-container.jsonschema)
and its simple
[array-of-arrays subschema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/array-of-arrays.jsonschema)
to which they adhere):

1. A `schema` JSON reference pointer to your data's JSON schema.
    See [JSON Schema](#JSON Schema).
2. A `metadata` JSON reference pointer to your data's JSON metadata.
    See [JSON Metadata](#JSON Metadata).
3. A `data` property which is an an array of arrays containing your tabular
    text itself. This property must adhere to the specific JSON schema
    referenced in the `schema` property above for this file.

#### JSON Schema

This document must itself be a valid
[JSON Schema](http://json-schema.org/documentation.html)
and must, moreover, adhere to the
[table format schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/table.jsonschema).

This simple document, besides including the text content, designates a more precise JSON schema to indicate precise column types (e.g.,
[this one](https://bitbucket.org/brettz9/bahaiwritings/src/6b07fb41d11ed76570f7da03ffc9d11aa8ff0a5d/data/writings/schemas/Bible.jsonschema?at=master&fileviewer=file-view-default)).

This schema is expected to designate an array of arrays, with the items
of the inner arrays being more flexible JSON schemas representing individual
fields of your works, but expecting a `type` and `title` in all cases.

It may, for integers, optionally also have `minimum` and `maximum` properties
which can be used to set numeric inputs (assuming the min or max is not
dependent on another value, as often will be paragraph numbers within
chapters).

For strings, an optional `"format": "html"` can be present, though raw HTML in
the so-designated fields will only be output in the results display as HTML
if the `TextBrowser` option `trustFormatHTML` is set to `true`. This
is for security reasons in case an untrusted schema is being deployed, but
one will probably normally wish to set this to `true` for trusted data.

Also for string type fields may one use `enum`, and its values are
currently used to determine field values (looking in the metadata
file under the localized `fieldvalue` object whose key is the column in which
the value occurs) which are used in place of the original content within
pull-down menus for selecting verse ranges and in the corresponding
column for the field of the results display. (The `fieldvalue-aliases`
property of the specific field key of the main `fields` property will
also be checked in that file for indicating optional aliases of the given
field value.)

#### JSON Metadata

[Meta-data JSON](https://github.com/brettz9/textbrowser/blob/master/general-schemas/metadata.jsonschema) (e.g.,
[this one](https://bitbucket.org/brettz9/bahaiwritings/src/6b07fb41d11ed76570f7da03ffc9d11aa8ff0a5d/data/writings/metadata/Bible.metadata?at=master&fileviewer=file-view-default))
is required so as for you to indicate for the app how the multilinear text
is to be browsed (e.g., which fields can be used as sequential
chapter/paragraph/verse numbers, how its columns should be translated, etc.).

This file has two main properties, `table` and `fields`.

`table` has two properties, `browse_fields` and `default_view`.

`browse_fields` is a name-set object or an array of string field names or
name-set objects. Name-set objects have an optional `name` string, a `set`
array of field name strings, and an optional `presort` boolean to
indicate whether the table must first sort the elements (in order of
listing); the default is to follow the original array order.

The keys of `default_view` are field names which point to a string or
integer, or array thereof. These are *not currently in use*, but are intended
to indicate the values that will be used for a default range when a user makes
a form submission without supplying a range.

For `fields`, the `lang` string property indicates the language code for the
content of this field. It is used for letting the user quickly enable
fields which match their desired locale language(s). It is also used for
setting HTML table column `lang` values to properly display fonts for
languages that leverage it, such as the CJK languages.

One other set of types for `fields` are `name` and `alias` strings (or
`localeKey` pointing to strings). The `name` points to the regular
name for the column, whereas `alias` is currently used to point to an
alias name of the field (more specifically to an alternate name after
converting its values via `fieldvalue-aliases`). The boolean or string
`prefer_alias` property in turn determines whether this alias will be
used by default (currently if it is `false`, it is not used at all).
This functionality might be moved into a plug-in in the future.

Also in `fields`, `fieldvalue-aliases` can after any `localeKey` processing,
be an object of field name keys pointing to an array of alias names (as
strings or integers) or to an object whose keys indicating the type of
alias and string values. This can provide alternate values for what is
actually present in the data table (e.g., replacing numeric codes with
human-readable strings).

For `fields`, the `primary_text_field` and `orig_lang_field` booleans
and `orig_langs` array of string language codes are *not currently in use*
but intended to indicate the main work under consideration (as opposed
to translations), whether it is the source of translations or a target
translation, and what its source languages are (if not itself marked as
an original language).

The `roman` property of `fields` is intended to indicate Roman numerals.
It is *not currently in use* and where not automated from Arabic numerals,
it might be indicated in the future via a language code and more generic
`numeric` property (so as to support multiple non-Arabic counting systems
which are hard-coded as opposed to built via an automated plug-in).

As with other files, there is also a `localization-strings` key object, keyed
to language code, which is keyed to an object of keys (which can be strings
(e.g., `heading` or `alias`), arrays of strings, or other objects of keys,
including specifically for JSON metadata, `fieldnames`, `fieldaliases`,
`fieldvalue`, and `fieldvalue-aliases`).

### Application-wide JSON files

Besides the JSON files directly representing your works, you will need the
following files to indicate behavior for the text-browsing application as a
whole.

#### `files.json`

This format is defined by [this](https://github.com/brettz9/textbrowser/blob/master/general-schemas/files.jsonschema).
See [this file](https://bitbucket.org/brettz9/bahaiwritings/src/5f2602f122134d2013e013a477ae94ee29548a13/files.json?at=master&fileviewer=file-view-default) for an example.

It allows you to point the application to the data files you desire for
inclusion (e.g., any kept in `data/`).

The optional string properties `schemaBaseDirectory` and
`metadataBaseDirectory` at root apply to all groups.

`groups` is a root array property whose items are file group objects whose
keys include the `id` string, the `name` string, the `directions` string
(for indicating instructions), as well as optional, group-scoped,
`schemaBaseDirectory` and `metadataBaseDirectory` properties.

The `files` array property contains object items with the following properties:
a `name` string or localization key (or a file group display name),
`schemaFile` and `metadataFile` string file paths (resolved relative to the
respective base path properties), and `file` which is an reference to a
specific JSON data file
[table-container.jsonschema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/table-container.jsonschema)).
There can also be a `shortcut` property which is used for indicating the
keyword to use when the "Generate bookmarks" button in Preferences or
"Copy shortcut URL" is used to build URL keyword shortcuts (what Chrome
considers a custom search engine).

As with other files, there is also a `localization-strings` key object, keyed
to language code, which is keyed to an object of keys (which can be strings,
arrays of strings, or other objects of keys, including specifically for
`files.json`, the object property `workNames` whose keys are work names, and
`plugins` whose keys are plugins and whose object values have a `fieldname`
key).

The `plugins` object property indicates scripts in metadata.

Its keys are plug-in names and whose value objects have the required property
`path`, and the optional properties `onByDefault` boolean and `lang` language
code string. There may also be a `meta` key which is used to pass data to the
plug-in. This object currently only allows string keys.

See [Plugin Format](#Plugin Format) for the structure of the plug-in pointed
to by the path.

The `plugin-field-mapping` object property has keys which act as groups and
whose object key values include works as keys and whose key values include
field names as keys and whose key values includes field arguments, namely:

- `placement` (the string `"end"` or a number to indicate placement relative
    to other properties; this might be changed to a string indicating field
    name)
- `applicable-fields` an object property whose properties are field names
    pointing to an object key value with properties that may vary with plug-in,
    but which specifically reserve a `targetLanguage` language code string
    property (or array of strings or the special string `{locale}` to indicate
    the value will vary be determined by the current locale) and a
    `onByDefault` boolean property. There is also a `meta` property object
    whose key values must currently only be strings.

#### `languages.json` and `locales/en-US.json`, etc.

Although we hope you may contribute back to our project any project-independent
changes you may need of the generic localizations within `locales/` and
`appdata/languages.json`, if you need to provide your own interface
localization, you may supply a `languages` property when creating the
`TextBrowser` object to point to a languages JSON file of your own
choosing (see the [JavaScript API](#JavaScript API)).

*TextBrowser* comes with the `languages.json` file at
[`appdata/languages.json`](https://github.com/brettz9/textbrowser/blob/master/appdata/languages.json) which, as mentioned, is used by default. It adheres to
[this schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/languages.jsonschema)

If you need to implement your own, the properties include the string
`localeFileBasePath` and the property `languages` which is an array
of objects containing the properties, `name`, `code`, `direction`,
and `locale` (the latter leads to a locale file).

As with other files, there is a `localization-strings` object, keyed to
language code, which is keyed to an object of keys (which can be strings,
arrays of strings, or other objects of keys).

The locale files referenced by the `locale` property within `languages.json`
(by default, those at `locales/`, e.g., `locales/en-US.json`), adhere to
[this schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/locale.jsonschema).

Locales are an object of keys (which may be strings, arrays of strings, or
are themselves objects).

Note that localization of specific file names and content, specific file
groups, and for your site navigation, on the other hand, are handled in
the other relevant sections of this document (see the `localization-strings`
property within metadata files, `files.json`, and `site.json`, respectively).

#### `site.json`

*(This file is not yet fully utilized in the app)*

This file expects a top-level `site` array property indicating nesting of the
site's page hierarchy (intended to be used for site map generation). The file
also expects a `navigation` property (with the same allowable values, or even
a [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
pointing to `site`) to indicate the subset of this site
available on the navigation bar (an array with strings or nested child
arrays of strings). Besides creating a navigation bar, it is
also intended to be used to generate breadcrumbs, `<link rel=next/prev>` links,
and a sitemap.

As with other files, there is a `localization-strings` object, keyed to
language code, which is keyed to an object of keys (which can be strings,
arrays of strings, or other objects of keys).

## Plugin Format

Plugin file designated within `files.json` may have any of the following
exports. See the subsection below for details on arguments shared by multiple
methods.

- `getCellData({tr, tableData, i, j, applicableField, fieldInfo, applicableFieldIdx, applicableFieldText, fieldLang, getLangDir, meta, metaApplicableField, $p, thisObj})` -
    Used to build the plugin field's cell contents. The return value will
    set `tr[j]` unless the return is falsy in which case `applicableFieldText`
    will be used. Invoked for each cell of the data. To return HTML, must use
    in conjunction with `escapeColumn: false`. Besides properties shared with
    other methods, `getCellData` is passed the following:
        - `tableData` - The entire set of table data as an array of arrays (of
            strings and/or integers), containing non-plugin content and any
            already processed plugin contents.
        - `i` - The 0-based row integer.
        - `tr` - Equivalent to `tableData[i]`
        - `fieldInfo` - Array of info about all fields; has the following
            properties if not a plugin:
            - `field` - The schema `title` if not a plugin
            - `fieldAliasOrName` - Obtained by finding alias if present
                or the `field` otherwise
            - `escapeColumn` - `true` if schema `format` is not `"html"`
            - `fieldLang` - The `lang` of the metadata object for `field`
            If it is a plugin, will have the following properties:
            - `plugin` - The `files.json` plugin object
            - `meta` - The plugin `meta`
            - `placement` - As with `plugin-field-mapping` `placement` but
                with `"end"` replaced with `Infinity`
            - `fieldAliasOrName` - The result of `getFieldAliasOrName` on
                the plugin if present or the localization of the `plugins`'
                `fieldname`
            - `escapeColumn` - `true` if the plugin's `escapeColumn` is not `false`
            - `onByDefault` - The `applicableField`'s `onByDefault` if a boolean,
                the current plugin's if truthy and `false` otherwise
            - `applicableField` - The `applicable-fields` field
            - `metaApplicableField` - The `meta` of the `applicable-fields` field
            - `fieldLang` - The `targetLanguage`
        - `applicableFieldIdx` - The `fieldInfo` item whose `field` property is equal to `applicableField`.
        - `applicableFieldText` - Equivalent to `tr[applicableFieldIdx]`
        - `fieldLang` - The `fieldLang` property of `fieldInfo[j]`
        - `getLangDir` - A method from
            [`rtl-detect`](https://github.com/shadiabuhilal/rtl-detect)
            for determining directionality ("rtl" or "ltr") for a given
            language code. May be useful with
            `fieldInfo[applicableFieldIdx].fieldLang`
- `escapeColumn` - Boolean (defaults to `true`). If set to `false`, will avoid
    escaping, though the plugin rendered cell data should be trusted to avoid
    possible cross-site scripting.
- `done({$p, applicableField, meta, j, thisObj})` - Invoked after all cells of
    the table have been processed.
- `getTargetLanguage({applicableField, targetLanguage, pluginLang, applicableFieldLang})` -
    Called for each plug-in. The return value will be used for setting the
    `lang` of the plug-in field. May return `{locale}` to indicate the
    language should follow the locale. The supplied `targetLanguage` is any
    `targetLanguage` property found on the `plugin-field-mapping`'s'
    `applicable-fields` field. `pluginLang` is the (default) `lang` for
    the plug-in (from `files.json`). `applicableFieldLang` is the default
    lang when there is no target language or plugin lang; it is the `lang`
    of the applicable field.
- `getFieldAliasOrName({locales, lf, targetLanguage, applicableField, applicableFieldI18N, meta, metaApplicableField, targetLanguageI18N})` -
    Called for each plug-in (after `getTargetLanguage`). Sets the `fieldInfo`
    `fieldAliasOrName` which is used for labeling the field. Besides
    properties shared with other methods, `getFieldAliasOrName` is passed
    the following:
    - `locales` - The app `lang` array (URL-specified `lang` languages or
        fallback-specified ones from `navigator.languages` that are
        supported by the app)
    - `lf` - An [imf](https://github.com/brettz9/imf) locale formatter based
        on `files.json` locale strings.
    - `applicableFieldI18N` - The localized metadata `fieldnames` `applicableField`
    - `targetLanguageI18N` - The localized name of `targetLanguage`
    - `targetLanguage` - The result of `getTargetLanguage` (or the
        `targetLanguage` argument to it if not present)

### Properties

A number of properties are passed to multiple plug-in methods:

- `$p` - Usable for getting URL parameters
- `applicableField` - The field indicated in `files.json` as being
    applicable to the plugin.
- `meta` - See the property from `fieldInfo`
- `thisObj` - The `TextBrowser` instance
- `j` (`i` is for column) - The 0-based column integer.
- `metaApplicableField` - See the property from `fieldInfo`

## Security notes

While some mechanisms exist to escape HTML, there are nevertheless some means
at present by which a malicious data file could perform XSS attacks. Please
ensure the data files (and schemas/metadata files) you indicate are trusted.

## JavaScript API

The following indicates the JavaScript options that can tweak your
application's behavior beyond that determined by your JSON and schema files.

See `resources/user-sample.js` for an example (where the sample paths
are assumed to be relative to a package that contains *TextBrowser*
as a `npm` dependency).

-   ***new TextBrowser(options)*** - Constructor which takes an options object
    with the following optional properties:

    -   `namespace` - Namespace to use as a prefix for all `localStorage`,
        caching, or `indexedDB` usage. Defaults to `"textbrowser"` but this
        could clash with other *TextBrowser* projects on the same origin,
        so you should change for your project. (This setting might be used in
        the future for any other namespacing.)

    -   `files` - Path for the `files.json` containing meta-data on the files
        to be made available via the interface. Defaults to `"files.json"`.

    -   `languages` - Path for the `languages.json` file containing meta-data
        on the languages to be displayed in the interface. Defaults to
        the `TextBrowser` project's `"appdata/languages.json"`.

    -   `site` - Path for the `site.json` containing meta-data on the site.
        Defaults to `site.json`. (Only used currently for localization,
        but may in the future provide surrounding navigation information
        such as breadcrumbs.)

    -   `userJSON` - Points to the user JSON file, `resources/user.json`
        by default. See the "User JSON" subsection below.

    -   `stylesheets` - Array of stylesheet paths and/or of two-item arrays
        with stylesheet path and
        [loadStylesheets](https://github.com/brettz9/load-stylesheets)
        options. A string path may also be `@builtin` which attempts to load
        the default stylesheet without need for path (but due to current
        browser limitations with a lack of import meta-data, we cannot
        provide this accurately for all configurations at the moment).

    -   `serviceWorkerPath` - Service worker path which defaults to
        `"sw.js"` (which, if you are including *TextBrowser* via npm,
        will be within your own project root). This should probably not
        be adjusted (and if you do want to adjust it, it may be better
        to file an issue or PR to allow us to provide choices among
        various default-available service worker/caching patterns).

    -   `dynamicBasePath` - Base bath for the server hosting the TextBrowser
        content. Defaults to the current site.

    -   `localizeParamNames` - Boolean as to whether to localize parameter
        names by default (can be overridden by the user in preferences).
        (This has not been fully tested.)

    -   `allowPlugins` - Enables `files.json`-specified plugins to be run.
        Defaults to `false` as it causes scripts to be run, but if you trust
        your JSON source files, you will presumably wish to enable this
        to get the full functionality designated within the JSON (and add
        the script files designated in `files.json` to your project).

    -   `trustFormatHTML` - If `true`, inserts fields designated by your
        JSON schema as `"format": "html"` as HTML without escaping; this
        option is off by default in case the source is untrusted,
        but if your `files.json`-indicated files are trusted, you will
        probably want to this set to `true`.

    -   `requestPersistentStorage` - Defaults to `true`. Set this to
        `false` if you don't want to even ask for permission to store
        the data files persistently. Note that this can really degrade
        performance, especially with large data files, as the whole data
        file must otherwise be downloaded for each result display.

    -   `noDynamic` - If there is no server-side component to expedite
        non-indexedDB queries

    -   `skipIndexedDB` - If one wishes to force avoiding indexedDB even
        when permitted by user (for testing)

    -   `hideFormattingSection` - Boolean as to whether to hide the formatting
        section by default (can be overridden by the user in preferences).
        This section might be changed to a plugin in the future in which case
        you'd just avoid designating it within `files.json`.

    -   `interlinearSeparator` - HTML code to be injected between each
        interlinear entry; this is not exposed to the user for
        security reasons (preventing [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)
        attacks); defaults to `<br /><br />` though one may set to
        another string such as `<hr />`. If you need greater control,
        you might consider monkey-patching the simple templating function
        `Templates.resultsDisplayServerOrClient.interlinearTitle` (and
        optionally setting `interlinearSeparator` to an empty string if
        you use that function to handle the separation), but please note
        that this API could change. We may add some predefined choices for
        users in the future.

    -   `showEmptyInterlinear` - Whether to show empty interlinear entries
        (with a title). We may put this under user control in the future.

    -   `showTitleOnSingleInterlinear` - If only the main item is present in
        an interlinear-enabled column, this determines whether a title (if
        enabled) will be shown. We may put this under user control in the
        future.

As per [semantic versioning](http://semver.org/) used by `npm`,
our API should continue to work until an increment in the major release
number.

The rest of the API used internally is unstable and should not be relied
upon for monkey-patching.

### User JSON

Worker config should be placed in a JSON file (see
[`resources/user-sample.json`](./resources/user-sample.json)).
The properties are:

- `namespace` - See above.
- `files` - See above.
- `languages` - See above.
- `basePath` - Base path to `files.json` fetches.
- `userStaticFiles` - Array of files additional to those of
    *TextBrowser* which you will need offline. Defaults to the minimum
    recommended files:
    `['/',  'index.html', 'files.json', 'site.json', 'resources/user.js', 'resources/user.css']`

## Server API

The `textbrowser` server API offers the same arguments as the `TextBrowser`
constructor (minus `site`, `stylesheets`, `requestPersistentStorage`, `noDynamic`,`skipIndexedDB`, and `hideFormattingSection`). In addition,
it supports the following arguments:

- `domain` - The domain for hosting the server. Defaults to `localhost`.
- `port` - The port on which the server will be hosted. Defaults to 8000.
- `nodeActivate` - This argument must be run once to build the necessary
    database files. While the database files will be SQLite based, they
    are consumed by [IndexedDBShim](https://github.com/axemclion/IndexedDBShim/).

## To-dos (Highest priority)

1.  Waiting: Avoid `rtl-detect` if
    [intl-locale-info proposal](https://github.com/tc39/proposal-intl-locale-info)
    gets implemented)
1.  [`navigator.storage.estimate`](https://developers.google.com/web/updates/2017/08/estimating-available-storage-space)
1.  Consider using `Intl.DisplayNames` (`type: 'language'`) plugins so can,
    e.g., show language visibly into which a targeted content language field
    was translated?
1.  Document and add screen-casts along with one for developers showing
    JSON format, metadata, and schemas); also use with shortcuts (including
    Bahá'í Library Online ones)
1.  For plugins, allow export of `stylesheets` array to add to
    `loadStylesheets`, so they don't have to do the importing and executing.
1.  **Progress meter** with hidden console to avoid intimidating loading
    messages of service worker; also retrieve latest in `CHANGES.md`!
1.  **Move "Go"** to right (or immediate bottom) of paragraph selections
1.  **Default field(s) and default value(s)** for when no text is entered and
    a reasonable sample is desired to be shown. Use `default_view` already
    spec'd in metadata schema and used in files.
    1. Also have `&checked1=Yes` omitted when generating results display
        (since now defaulting to this)
1.  Overflow on cells past a certain height—especially for indexes
1.  In place of passing in `files`, `namespace` and `languages`, pass
    in `userJSON`
1.  If get [MapText](https://github.com/brettz9/maptext) working, could
    actually extract out image portion(s) into table cell to show the
    original Tablet portion alongside commentary, etc. (along with
    MapText tooltips and text copy ability to get at the real text
    from the images; ideally any global search would be able to reach
    into these as well, though that will probably just duplicate what
    is already in the corresponding JSON store as a regular text column).
1.  **Text box parsing**
    1. Document availability of this parsing
    1. Fix limitation that 0's don't change to 1's if
        not present as a minimum (e.g., if no 0 for Chapter
        number, then won't show anything).
    1. Avoid need for separate `startEnd` for browse set;
        e.g., parse Rodwell or Sale?
    1. Ideally work across even book
    1. Support anchor portion (e.g., `1:2:3-1:2:5#1:2:4`)
1.  **Move plug-in set-up** to run so setting indexedDB within
    `activateCallback.js`
1.  Have **IndexedDB handle all pages** language select, work select, and
    work display be part of too?
1.  **Node.js** (or PHP?)
    1.  Delivery of HTML content by same URL so third parties can
        consume without JavaScript and optimized when not offline
        1.  [Progressive enhancement is faster](https://jakearchibald.com/2013/progressive-enhancement-is-faster/)
            1.  Optimize Jamilih to build strings (for performance and also for
                server) and utilize here; also to preprocess files like our
                templates to convert Jamilih to complete string concatenation
                as is somewhat faster
        1.  Serve JSON files immediately and then
            inject config for `index.js` to avoid reloading?
        1.  Use [IndexedDBShim](https://github.com/axemclion/IndexedDBShim)
            (with service worker shim?) to optimize on server
1.  Icon for click/hover to get **interlinear field explanation**
1.  Fix for **local notes storage plugin** when in interlinear column
1.  Fix for **interlinear not showing** when opting for non-default
    "Field Title" in pull-down.
1.  Fix for **"Save settings as URL"** not properly serializing plug-in
    columns
1.  Allow **localization of URL parameters** to optionally work with any
    language (or at least the locale and default/English)
1.  Fix sometime **obscuring of headings**
1.  **Document**
    1. Need of setting certain locale strings, including `sites.json`.
1.  Use schema-detection of type for sorting--integer
    parsing only on URL params per schema); see
    `resultsDisplayServerOrClient.js` with to-do by `parseInt` (and
    also see `String()` conversions)
1.  Get file names to be namespaced to group name to avoid name clashes
1.  **Locales**
    1.  Check `localizeParamNames` (preference)?
    1.  Test all locales and works and combos
1.  Allow **all text** to be shown (whether anchored or not)
1.  Indicate min/max as **placeholder text** (`Max: 100`?)
1.  **Rename "Field"** to "Column anchor"
1.  Renaming/linking to fuller descriptions or graphics explaining
    options/preferences regarding locale, interlinear, CSS
1.  **Plugins/Automated** fields
    1. **Extensibility** (note: Some below may already be implemented)
        1.  Implement (worker-sandboxed (and parallel async-loading per
            row/cell?)!)
        1.  Admin/files-driven and ideally user-driven (though security issue
            for additive approach); could let plugin itself accept user input
        1.  Additive or reductive (omitting/merging)
            1.  Columns or rows
                1.  Admin-controlled merging/omission of columns like
                    interlinear
                1.  Merging rows with same number
                1.  Metadata for default field column placement and table/field
                    applicability
        1.  Browse fields or field list
        1.  Modifying existing content or not
            1.  Splitting columns (e.g., by line break)
            1.  Splitting rows by element (e.g., `<hr />`)
                1.  With optional `rowspan`/`colspan` for non-split portions
                    of row/column
            1.  Overlays
        1.  Levels of applicability
            1.  Automated whole document/table-level or column-level
                changes (e.g., word counts) or even row-level/cell-level
                (including language code)
            1.  Spans across section
        1.  Provide example plugins of each type for this version if possible
        1.  Define all possible areas as plugins? e.g., Move
            search/CSS/interlinear, advanced formatting, or even browse fields
            and/or field lists and/or search as a whole to plugins?
            If doing so for individual fields in field lists, should support
            adding, e.g., pull-downs, even multiple ones for arguments
            (e.g., a web search plugin could specify the desired search engine)
        1.  Asycnchronous means of retrieving (and then caching, optionally on
            an interval) automated data; use of single Promise to each plug-in
            for whole table (or if necessary `Promise.all` on each row)?
    1.  **Caching for automated field content** like translations (with ability
        to rebuild)
    1. **Collapsible columns** with click status remembered from last time as
        to whether collapsed or not
    1.  Specific **automated fields**
        1. Previously implemented:
            1.  Option to show renamed fields (like "Book #" -> "Book Name"
                for Bible) before renaming (reimplement as additive plug-in
                but with one field on by default and the other off); already
                has placeholder in `files.json` - add to `field-alias.js`;
                already added to new version but need to reimplement as plugin
            1. Synopsis, Roman numerals, Chinese numbers, word-by-word
                translation, auto-romanized Persian/Arabic, Persian with
                English tooltips, English with Persian/Arabic tooltips, ISBN
                for Collins (use JSON Schema `format` for link detection--might
                also reimplement ISBN to make use of JSON Schema format);
                text-to-(Google search, Google define, Wikipedia, etc.
                edit pages)-links
        1.  Auto-links by verse to relevant forums, wikis, blogs, or personal
            notes pertaining to a given verse; also Q&A and (federated)
            social media
            1. Offers advantage of not needing to reinvent login control
            1.  Built-in (including offline or only offline) note-taking
                (local/remote and wiki WYSIWYG with Git version control?);
                modular loading of others' notes?
        1.  Back-links for index entries (which needs its own JSON Schema-based
            project for the hierarchical representations (see
            [TEI](http://www.tei-c.org/release/doc/tei-p5-doc/en/html/CO.html#CONOIX)
            for ideas)) including optionally merging them for different books
        1.  Support metadata to omit or combine fields during browsing (like
            checkboxes and interlinear field, but admin-set; also ensure, or
            add option for, no line breaks or indication of original source
            column within interlinear display so not bloating or surfacing
            internal column differences to users); increment counts despite
            some surfacing, as better ensures future compatibility/portability
        1.  Automated field to split up rows based on presence of `<hr />` or
            `<a id=>`, etc., with the ability to browse by such numbers (would
            ideally tap into browsing autocomplete code indicating min/max
            too). Optionally get `rowspan`s (or even `colspan`s) for additional
            columns (e.g., a field spanning by whole pages of a book and
            another field spanning only by paragraphs) - use some kind of
            counter and don't display the HTML until finished cycling??; also
            figure out how to reassemble if the minute fields are not needed
            (e.g., if the user only wants to see the text by paragraph and
            not anything related to by page); will provide a new browsing
            column and also divide certain existing one(s)
        1.  Allow automated algorithm to merge, remove rows (e.g., intro
            section of text with same "0" number)
        1.  Splitting columns by line break, etc.
        1.  Means on results display page to highlight (including
            discontiguous) selections and convert this into a new selection
            and/or syntax (generic to *TextBrowser* and/or canonical, ideally
            human-readable based on JSON-supplied information; e.g., for the
            Bible, `Matt. 5:10-12`); use with `postMessage` to-do to supply
            syntax back to another site
        1.  Correct any field easily by links within TB to editing interface
        1.  Add an "overlay" column like interlinear, but which overlays by
            tooltip if any data is present; can also use metadata if the
            overlay is within-cell (and this metadata can also be used for
            putting overlay data in its own column too, albeit with only
            partial mapping to the other columns, e.g., if our "Baha'i
            translation" had not already been put into its own column, a
            metadata mapping may only have been for two discontiguous
            sentences out of a paragraph, but could still show such sentences
            reassembled (with some kind of separator) in a paragraph-based
            cell)
            1.  Deal with other metadata/automated (besides overlays) which is
                intended to allow collapsing of ranges (above paragraph cells,
                but may overlap); do as multiple tbodies but needs to be done
                dynamically since may wish alternate (and nestable) collapsing
                (e.g., collection->book->chapter, user-contributed metadata
                sections, etc.); allow collapsing/expanding of all fields by
                one click button outside table (or by level); allow automated
                collapsing based on sequentially exact values (e.g., until
                rows stop having a column with value "1")
            1.  Allow collapsing even within cells (as with overlays) (like
                our "Baha'i Translation" could have been). Also make
                non-metadata regions collapsible so can hide them from view.
            1.  Allow something to be prefixed to interlinear number to
                indicate the field should be treated as an overlay (tooltip);
                if so, may need tooltip to be in blocks in case multiple
                columns added. But also need to have section for automated
                fields separate from the regular fields for those fields
                which do not map exclusively by cell boundaries (or
                relatively within them).
            1.  Allow types of overlays (or "mashes") such as underlays (adding
                invisible metadata), onlays/"mash ons" (replacing text in
                place), as well as regular overlays (adding text via
                mouseover); let these be alterable as possible by the user
                (e.g., text might be desirable to replace existing text or
                put it as a mouseover)
            1.  Allow for dynamic addition of JSON overlay sources or metadata
                to work selection/work display files?
            1.  See bahaiwritings project re: using Firefox's
                [Browser API](https://developer.mozilla.org/en-US/docs/Web/API/Using_the_Browser_API)
                to allow independent navigation controls for each iframe (and
                side-by-side viewing of verses/lines and commentary)

## To-dos (High Priority)

1.  Waiting ([JSON UI Schema](https://github.com/json-schema-org/json-schema-spec/issues/67)
    or [JSON Schema Annotation and Documentation Extension](https://github.com/json-schema-org/json-schema-spec/issues/136)):
    i18n: Utilize more standard mechanism instead of our `localeKey`;
    might also use substitutable JSON References (see
    <https://github.com/whitlockjc/json-refs/issues/54#issuecomment-169169276>
    and <https://github.com/json-schema-org/json-schema-spec/issues/53#issuecomment-257002517>).
    0. Remove need for separate metadata files per
        <https://github.com/json-schema-org/json-schema-spec/issues/587#issuecomment-389726603>
        by using initial `$`?
1.  Find way to avoid need for `!important` in column CSS
1.  Offer more border styling tuning controls (including right/left/top/bottom,
    color, etc.); then offer this along with other styles if we replace CSS
    input box with pop-up styling form (like Advanced Formatting, but for columns)
1.  Refactoring: Try to use `deserialize` of `form-serialization` fork for initial population
    or hash change?
1.  We should try to allow `onByDefault` and `placement` for non-plugin
    fields also
1.  [ES6 Modules in browser](https://jakearchibald.com/2017/es-modules-in-browsers/):
    Complete switch to imports over script tags (by updating dependencies to
    use ES6 modules too and then use them; json-refs is only left); can also
    avoid function-passing main functions as arguments
    1.  For json-refs, build on
        <https://github.com/whitlockjc/json-refs/pull/149> before
        ES dist. (Rollup or webpack CLI?) and `browser`/`module`
    1.  Apply <https://www.gnu.org/software/librejs/free-your-javascript.html>
        labels to provide machine-automated detection of licenses. (Adapt
        [LibreJS](https://www.gnu.org/software/librejs/) to work with
        WebExtensions, to support `<link>` in addition to visible links, and,
        if it is not already, make blocking of sites without open source code
        optional but notify one by icon so that one might know that a page is
        using (or not using) open source.)
1.  Add prior transpose functionality (affects header, footer, and body)
1.  Expose interlinear `showEmptyInterlinear` and
    `showTitleOnSingleInterlinear` to the user interface
1.  Uncomment and complete random code
    1. random within specific part of browse field range (e.g., within a
        specific book)?
        1. Have special meta-data for per book/chapter maximums (Bible/Qur'an)
            to allow accurate and also for random verses?
    1.  with context
    1.  Leverage this code for random to implement random feature across
        works within group or across all groups
1.  As with table/array-of-arrays schema, develop schema for
    outlines (and utilize, e.g., with JSONEditor)!
1.  Develop footnote targeting mechanism to hide/reveal footnotes inline
    (based on a `data-footnote` attribute or the like). Utilize JSON
    Schema `links` for indicating footnote location in document then
    allow HTML `<a href>` to point to the scheme designated therein.
1.  Search/Sorting
    1.  Add to preferences system for saved/favorite, recent
        searches/browses, etc.
    1.  Specific filtering by textbox next to checked field selection
        (commented out in workDisplay as not working yet in resultsDisplay)
    1.  Schema-aware and metadata-aware column sorting options (e.g., sort by
        order and ASC/DESC) with user customizability (i.e., presorting along
        with dynamic client-side after-load sorting, with or without search
        filtering; use "search" in locale to add this filtering to UI)
    1.  Option for highlighting search terms (with own styles), and/or if
        context is specified, to highlight rows with search results and
        alternatively style context rows (distinguish from random context?)
    1.  Optional links to go to previous/next results if only loading a subset
        of available content (allow customization of size of chunking in
        preferences as well as on the fly)
    1.  Support user-driven or automated (expandable) ellipses for surrounding
        content with option for highlighting these (e.g., to highlight a
        parts of a sentence, including one spanning multiple rows/verses);
        consider range for highlighting if verse range + added context range
        not enough
    1.  Ability to run XPath/`querySelector`-like queries against
        `format: "html"` fields relative to specific cells (or against
        original source HTML or XML document); also highlighting as
        part of page anchor ala original XPath schemes (e.g.,
        `&anchor=.myClass` with `text()` from [HTTPQuery](https://github.com/brettz9/httpquery)
        to identify by text content too if not a full blown
        query/transformation language)?

## To-dos (Medium Priority)

1.  Remove need for separate metadata
    files per
    <https://github.com/json-schema-org/json-schema-spec/issues/587#issuecomment-389726603>
1.  Remove `form-serialization` in favor of
    [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)?
1.  Replace comma-separated interlinear approach with a popup dialog
    with multiselect
1.  Preview styling changes (or move all controls to results page for
    immediate real feedback)
1.  Separate formatting within Jamilih code to CSS; unit test and performance
    by being able to use a natively stringifying version of Jamilih
    (once complete)
1.  Utilize meta-data properties, `primary_text_field`, `orig_lang_field`,
    `orig_langs`, e.g., to allow for user to display main language and
    originals but not others? Use `hasFieldvalue` and `roman` (for
    non-automated Roman fields--could designate as Latin language, but
    need a way to know are numerals for sorting if Arabic numerals not
    provided)?
1.  URL (sorted) params keyed to `outerHTML` of page for caching
1.  Incorporate speech synthesis from
    <http://bahai.works/MediaWiki:Common.js>, allowing different
    speech voices for different rows or columns (or just let user
    add CSS to columns to mark). Could optionally display speech
    controls on results display page
1.  Callback options to replace or receive the results from each screen for
    further manipulation (e.g., to add navigation, pending or different from
    the intended `sites.json` behavior).
1.  Allow tables to be re-sortable via JavaScript which allows
    sorting by multiple columns with various data, etc.
1.  Build library (for browser or Node) to utilize `site.json` file to add
    site-wide navigation bar headers, breadcrumbs,
    `<link rel=next/prev/contents/etc.>`, sitemap, and page title (supplied
    argument of the current page)? Also about text and removecookies/
    choose a different language, and ability to optionally turn off in
    results display (e.g., so a table's results can be embedded off-site).
1.  Support JSON types for `outputmode`, opening
    new window with content-type set
1.  Node.js (and/or PHP)
    1.  Optionally allow server push and/or WebSockets updates of
        content and software
        1.  Allow centralized copies or distributed versioning,
            including single copy storage
    1.  Make tools to build `languages.json` based on available
        locale files, and build `files.json` based on a target directory.
    1.  [HTTPQuery](https://github.com/brettz9/httpquery) headers
1.  `filetypes.json` (from WebAppFind) for app and schema association?
    (files.json for permitted files - a file which could be auto-created,
    e.g., if server permits all in a directory); especially potentially
    useful with JSONEditor to allow editing of these files, app types
    (replacing assistant.php):
    1.  langs + locale / locale only
    1.  files/dbs->file (supply language choice)->file contents
    1.  schemas
1.  Code to populate locale files with missing localization strings and
    report the missing ones (and sort as such in assistant file); put
    assistant localization keys in own file?
    1.  Find translators to do further localization of the interface
    1.  Assistant file (for translating; needs server for password);
        work optionally with main locales, files, table, and field
        locale info. Use already-existing localization strings.
    1.  Add tooltips and table summaries, etc. back (see locale file for
        these and reapply any other unused) and add any missing ones
        describing how to use the elements
1.  Give option to user (as opposed to admin) for preset interlinear choices
    (e.g., separate by line breaks or page breaks)

## To-dos (Lower priority)

1.  Use or publish [rollup-plugin-postprocess](git+https://github.com/brettz9/rollup-plugin-postprocess.git#update)
    as stable version
1.  Check if still getting superagent warning:
    <https://github.com/whitlockjc/path-loader/issues/17> (if `json-refs` can
    be updated to stable version)
1.  Use [i18nizeElement](https://github.com/brettz9/i18nizeElement)? (probably
    not as need RTL detection for more than setting on element)
1.  Remember columns enabled, etc. since last visit, and/or saved as
    preferences.
1.  Allow copy-pasting a search as a custom web protocol (make
    site-configurable), e.g., to support `web+bahaiwritings:` links per
    [bahai-writings-handler](https://github.com/brettz9/bahai-writings-handler)
    ([demo](https://bahai-library.com/test-bahai-web-protocol/test-bahai-web-protocol.html));
    could even use last visit or preferences status to tweak the resulting
    appearance, column selection, etc.
1.  In schema, let `$locale` or `*` indicate all fields to be translated
    where possible?
1.  Preferences
    1.  Change Preferences to be set before work or with work but specific
        to it
    1.  Change Preferences to disallow URL overriding
    1.  Change preferred languages preference to be dynamic with work
        column languages
        1.  Preference to remember enabled checkboxes and formatting
1.  Change to utilize history.pushState?
    <https://developer.mozilla.org/en-US/docs/Web/API/History_API>
1.  Use ES6 modules (babel)
    1.  dynamic or hierarchical loading of CSS too?
1.  Sort file selection listing per locale?
1.  Node.js synchronization of locale files?
1.  Could allow Node to built schemas, optionally allowing or disallowing
    unresolved JSON References.
1.  Might support arbitrary JSON and JSON Reference querying
   (if `files.json` configured to indicate a wildcard or something)
1.  Update "about" text and utilize on popup or something?
1.  Change "Saving settings as URL" to a redirect if faithfully
    copying everything?
1.  Provide option to skip over `langs.json` with a default language
    (though discourage since the UI translations may help some people).
1.  Allow user to pass array of language codes that can be checked
    at the beginning of the string without need for `lang=` (or for
    the i18n of "lang"?).
1.  `window.postMessage` API (since CORS is only for Ajax and
    `document.domain` is only for subdomains).
1.  `indexedDB` for JSON data
1.  Restore `tabindex` usage
1.  Restore option from work page to have a checkbox on whether to go to
    "Advanced mode", opening the styling options by default or not.

## Testing

If you instead merely wish to test the current repository, you can:

1. Clone the repository. Note, however, that we may periodically
rebase the code, making it harder for one to keep up to date in this manner.
2. Install the package's dependencies via:
```shell
npm install
```
3. Test via:
```shell
npm test
```

Note, however, that much of testing will depend on a particular
application. The [bahaiwritings](https://bitbucket.org/brettz9/bahaiwritings/)
project hosts validation of specific files expected by TextBrowser, such as
`files.json` and specific schemas and meta-data files needed for that project.

If you merely wish to see the app running in a server, you can run:

```shell
npm start
```

If you do not wish to automatically open a tab each time the command is
run, use:

```shell
npm run start-no-open
```

You can also use this latter option to run the browser tests
(from <http://127.0.0.1:8080/test/>).

## Contributing

PRs are most welcome, including for additional languages/locales.

Tests will ideally be run before submission of a PR.

At present we only have schema validation and lack UI and unit
testing coverage (PR's welcome for this too!).

Note that we hope to create an extensible plug-in system, so
enhancements to the core ought to be confined to the
main project goals and be oriented toward reuse across all
projects, relegating any specialized tools to plugins (though
we can set up the wiki to point to your plugins once a plugin
system may be in place).

## History

One PHP/MySQL-based version was released in 2005-12-22 and was my
first project used in aiding my learning programming.

It was hosted at <http://bahai-library.com/browser/> and
<https://bahai9.com/browse0.php>

On Bahá'í Libary Online, the Web Archive indicates its presence as far back
as 17 May 2006:

- <http://web.archive.org/web/20060517012851/http://bahai-library.com:80/browser/browse0.php>
- <http://web.archive.org/web/20060505010948/http://bahai-library.com:80/browser/browse0.php?langu=en>
- <http://web.archive.org/web/20060430170322/http://bahai-library.com:80/browser/browse.php?langu=en&file=Bible>

It was broken (or offline) for long periods of time after an upgrade of PHP
applied to the server broke the old code and for which I did not find time
to work around.

## About

This initiative is associated with the
[BADI](https://groups.yahoo.com/neo/groups/badi/info)
mailing list created to foster collaboration among open source projects
and initiatives such as this which are Baha'i-inspired but will or may be
of interest to the wider software community as well.
