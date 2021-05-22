[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/elias-sundqvist/obsidian-static-file-server?style=for-the-badge&sort=semver)](https://github.com/elias-sundqvist/obsidian-static-file-server/releases/latest)
![GitHub All Releases](https://img.shields.io/github/downloads/elias-sundqvist/obsidian-static-file-server/total?style=for-the-badge)
# Obsidian Static File Server

This is a plugin for Obsidian (https://obsidian.md).

It allows you to host obsidian subfolders as static file servers.

**Why?**

There are a number of reasons why one might want to do this

- Embed websites in your vault that work offline
- Embed websites with CORS issues
- Access your vault files from other applications

## Demonstration
![](images/static%20file%20server%20demo.gif)

## Getting Started 

1. Install the plugin
2. Make a folder in your vault
3. Put some files in the folder
4. Open `Static File Server Settings` and enter the name of the folder and a port number.
5. You can now display the files in an iframe
   * For example, a file called `example.html` could be accessed with  
     `<iframe src="http://localhost:1337/example.html"/>` 

## Contributing

Feel free to contribute.

You can create an [issue](https://github.com/elias-sundqvist/obsidian-static-file-server/issues) to report a bug, suggest an improvement for this plugin, ask a question, etc.

You can make a [pull request](https://github.com/elias-sundqvist/obsidian-static-file-server/pulls) to contribute to this plugin development.

## Changelog

### 0.0.2 (2021-05-04) *Fixed misleading setting placeholder*
* The folder path should not be prefixed with a `/`. Changed the placeholder from `e.g. /somepath` to `e.g. FolderName`

### 0.0.1 (2021-05-04) *First Release*
* Basic functionality of the plugin implemented

## License

[Obsidian Static File Server](https://github.com/elias-sundqvist/obsidian-static-file-server) is licensed under the GNU AGPLv3 license. Refer to [LICENSE](https://github.com/elias-sundqvist/obsidian-static-file-server/blob/master/LICENSE.TXT) for more information.