/**
 * Change the extension of a file name.
 * @param fileName The file name to change.
 * @param newExtension The new extension to apply.
 * @returns The file name with the new extension.
 */
/**
 * Change the extension of a file name.
 * @param fileName The file name to change.
 * @param newExtension The new extension to apply.
 * @returns The file name with the new extension.
 */
export default function changeExtension(fileName: string, newExtension: string) {
	// Ensure the new extension starts with a dot
	const extension = newExtension.startsWith(".") ? newExtension : "." + newExtension;

	// Find the last dot in the file name
	let dotIndex = fileName.lastIndexOf(".");

	// If no dot is found, append the new extension
	if (dotIndex === -1) {
		return fileName + extension;
	}

	// Replace the existing extension with the new extension
	return fileName.substring(0, dotIndex) + extension;
}
