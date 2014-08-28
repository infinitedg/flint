/// NOTE -- This documentation is more notes, and may not be entirely correct
/// Review the code to determine full accuracy and implications
Flint.assetUrl('/path/to/asset/keyname')
	Returns the URL to the asset
	If it's a directory, return undefined

Flint.directory('/path/')
	Returns database object for this directory node
	If it's an asset, return undefined

Flint.assets('/path/')
	Returns all assets in a given path, going recursively down the tree
	If the path is an asset, it returns all assets in its folder

Flint.assetObject('/path/keyname')
	Returns the raw asset object from the system, based on the current simulator
	If we aren't in a simulator, returns the default


* Indicates a generated property
@ Indicates a watched property

//  flintAssetFolders
{
	_id: 
	@name: "sounds"
	@parentFolder: _id of parent folder, unset if at root
	@fullPath* // folderPath + / + name
	@folderPath* // Same as parent's path, or / for root
}

// flintAssetsContainers
{
	_id
	folderId: // ID of flintAssetFolder, unset if at root
	@name: "keyName"
	@fullPath* // Parent's 
	@folderPath* // 
}

// flintAssetObjects
/// This basically serves as our rapid cache mechanism, too
{
	_id: 
	containerId: // ID of flintAssetsContainer
	simulatorId: // This key doesn't exist if it's the default
	objectId: // ID of object in CFS
	containerPath* // The path to this container of objects
	folderPath* // The path to the parent folder of this container
	mimeType*
	objUrl*
}



Objects:

assetFolders -- The hierarchy of the system
assetContainers -- A container of objects inside a folder
assetObjects -- The actual file located in an asset keypath, by simulator


Observer chains:

folder.name 			=> folder.fullPath
folder.parentFolder		=> folder.fullPath
folder.fullPath			=> folder.folderPath

folder.fullPath			=> container.fullPath
container.folderId		=> container.fullPath
container.name 			=> container.fullPath
container.fullPath		=> container.folderPath

container.fullPath		=> object.fullPath
object.containerId		=> object.fullPath
object.fullPath			=> object.folderPath
