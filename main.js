const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./src/actions')
const CreateClient = require('./src/connect')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.initWebSocket()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
		this.initWebSocket()
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: '7CG IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: '7CG Port',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	initWebSocket = () => CreateClient(this)
	updateActions = () => UpdateActions(this)

}

runEntrypoint(ModuleInstance, UpgradeScripts)
