import fs from "fs"
import path from "path"
import chalk from "chalk"
import getConfig from "src/utils/config"
import cleanPath from "src/utils/cleanPath"

export type Args = {
	profile: string
}

export default async function profileUse(args: Args) {
	args.profile = cleanPath(args.profile)

	const config = getConfig()

	if (args.profile === config.data.profileName) {
		console.log('already using this profile!')
		process.exit(1)
	}

	if (!fs.existsSync(path.join('.mcvcli.profiles', args.profile)) || !fs.existsSync(path.join('.mcvcli.profiles', args.profile, '.mcvcli.json'))) {
		console.log('profile not found or invalid!')
		process.exit(1)
	}

	if (fs.existsSync(path.join('.mcvcli.profiles', config.data.profileName, '.mcvcli.json'))) {
		console.log('profile folder is not empty!')
		process.exit(1)
	}

	await fs.promises.mkdir(path.join('.mcvcli.profiles', config.data.profileName), { recursive: true })
	
	const files = fs.readdirSync('.').filter((file) => !file.startsWith('.mcvcli.profiles'))
	files.forEach((file) => fs.renameSync(file, path.join('.mcvcli.profiles', config.data.profileName, file)))

	const profileFiles = fs.readdirSync(path.join('.mcvcli.profiles', args.profile))
	profileFiles.forEach((file) => fs.renameSync(path.join('.mcvcli.profiles', args.profile, file), file))

	console.log('switched to profile', chalk.cyan(args.profile))
}