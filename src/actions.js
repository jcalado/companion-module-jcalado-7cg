const indexInput = { id: 'index', type: 'number', label: 'Index', default: 1, min: 1, max: 5000 }
const valueInput = { id: 'value', type: 'textinput', label: 'Name' }
const idInput = { id: 'id', type: 'textinput', label: 'ID', tooltip: 'Check the FreeShow configs to find ids' }
const volumeInput = { id: 'volume', type: 'number', label: 'Volume', default: 1, min: 0, max: 1, step: 0.1 }
const gainInput = { id: 'gain', type: 'number', label: 'Gain', default: 0, min: 0, max: 1, step: 0.1 }
const transitionInputs = [
	{
		type: 'dropdown',
		label: 'Text or Media?',
		id: 'id',
		default: 'text',
		choices: [
			{ id: 'text', label: 'Text' },
			{ id: 'media', label: 'Media' },
		],
	},
	{
		type: 'dropdown',
		label: 'Type',
		id: 'type',
		default: 'fade',
		choices: [
			{ id: 'none', label: 'None' },
			{ id: 'blur', label: 'Blur' },
			{ id: 'fade', label: 'Fade' },
			{ id: 'crossfade', label: 'Crossfade' },
			{ id: 'fly', label: 'Fly' },
			{ id: 'scale', label: 'Scale' },
			{ id: 'spin', label: 'Spin' },
		],
	},
	{ id: 'duration', type: 'number', label: 'Duration (ms)', default: 500, min: 0 },
	{ id: 'easing', type: 'textinput', label: 'Easing', default: 'sine' },
]
const variableName = {
	id: 'name',
	type: 'textinput',
	label: 'Variable name',
	tooltip: 'The name of the variable that should be changed',
}
const variableInputs = [
	variableName,
	{ id: 'value', type: 'textinput', label: 'Value', tooltip: 'Keep empty to toggle on/off' },
	{
		type: 'dropdown',
		label: 'Action',
		id: 'variableAction',
		default: '',
		choices: [
			{ id: '', label: 'None' },
			{ id: 'increment', label: 'Increment' },
			{ id: 'decrement', label: 'Decrement' },
		],
	},
]



module.exports = function (self) {
	const actionData = {
		// PROJECT
		index_select_project: { name: 'Select project by index', options: [indexInput] },
		next_project_item: { name: 'Next project item' },
		previous_project_item: { name: 'Previous project item' },
		index_select_project_item: { name: 'Select project item by index', options: [indexInput] },

		// SHOWS
		name_select_show: { name: 'Select show by name', options: [valueInput] },

		// LYRICS
		select_songbook: { name: 'Hymns: Select songbook' },
		lyricsPrevious: { name: 'Hymns: Previous verse' },
		lyricsNext: { name: 'Hymns: Next verse' },
		lyricsStop: { name: 'Hymns: Stop showing lyrics' },
		lyricsPlay: { name: 'Hymns: Start showing lyrics' },
		lyricsReset: { name: 'Hymns: Restart lyrics' },
		load_hymn_number: { name: 'Hymns: Load hymn number' },

		// LOWER-THIRDS
		next_lowerthird: { name: 'Lower-thirds: Next Lower-third' },
		previous_lowerthird: { name: 'Lower-thirds: Previous Lower-third' },
		lowerThirdPlay: { name: 'Lower-thirds: Play Lower-third' },
		lowerThirdStop: { name: 'Lower-thirds: Stop Lower-third' },
		preview_lowerthird: { name: 'Lower-thirds: Preview Lower-third' },

		// CREDITS
		play_credits: { name: 'Credits: Start' },
		stop_credits: { name: 'Credits: Stop' },

		toggle_channel_id: { name: 'Toggle channel ID' },
		toggle_channel_bugs: { name: 'Toggle channel bug' },


		// CLEAR
		emergency: { name: 'Emergency' },

		// OTHER
		change_variable: { name: 'Change variable', options: variableInputs },
		custom_message: {
			name: 'Custom API message',
			options: [
				{ id: 'id', type: 'textinput', label: 'API ID' },
				{ ...valueInput, tooltip: 'Format as stringified JSON. E.g: {"value": "hi"}' },
			],
		},
	}

	let actions = {}
	Object.keys(actionData).forEach((id) => {
		let data = actionData[id]
		let action = data

		if (!action.options) action.options = []
		action.callback = (event) => trigger(event)

		actions[id] = action
		self.log('info', `Added action: ${id}`)
	})

	self.setActionDefinitions(actions)

	function trigger(event) {
		self.log('info', `Action triggered: ${event.actionId}`)
		let config = self.config
		if (!config.host || !config.port) return

		// add options if missing
		if (!event.options) event.options = {}

		// format data
		let action = event.actionId
		let data = { ...event.options, action }

		// custom message
		if (action === 'custom_message') {
			action = data.id
			data = { ...JSON.parse(data.value || '{}'), action }
		}

		// log action
		let options = Object.keys(event.options).length ? ` + ${JSON.stringify(event.options)}` : ''
		console.log(`Sending action: ${action}${options}`)

		self.send(data)
	}
}
