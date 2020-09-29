# docker-bluelinky
Unofficial Hyundai Blue Link API (bluelinky) Container

This is a docker version of an API Wrapper for bluelinky. For information or issues, please raise them on the [bluelinky repo](https://github.com/Hacksore/bluelinky).

## Instructions
1. In the /config directory, create a new file named `config.json`
2. Copy the contents of the `config.json.example` this new file
3. Edit `config.json` adding in the required connection details for you BlueLink account & region
4. Start the Container

Show some love to the Original Developers over at the [bluelinky repo](https://github.com/Hacksore/bluelinky)

# Running with a volume
This will start a container detached listenting on port `8080` using the `config.json` at your current directory. You can then start hitting the routes you need.
```shell
docker run -d -p 8080:8080 -v "${PWD}:/config" wranglatang/bluelinky
```

# Unraid
TODO