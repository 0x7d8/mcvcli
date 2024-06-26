import fs from "fs"
import path from "path"
import getConfig from "src/utils/config"
import cleanPath from "src/utils/cleanPath"

export type Args = {
	profile: string
}

export default async function profileDelete(args: Args) {
	args.profile = cleanPath(args.profile)

	const config = getConfig()

	if (!fs.existsSync(path.join('.mcvcli.profiles', args.profile))) {
		console.log('profile not found!')
		process.exit(1)
	}

	if (args.profile === config.data.profileName) {
		console.log('cannot delete current profile!')
		process.exit(1)
	}

	await fs.promises.rm(path.join('.mcvcli.profiles', args.profile), { recursive: true })

	console.log('profile deleted!')
}