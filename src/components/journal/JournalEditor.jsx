import { useState } from 'react';

const TAG_OPTIONS = [
	{ value: 'none', label: 'None', color: 'bg-gray-100 text-gray-700' },
	{
		value: 'progress',
		label: 'Progress',
		color: 'bg-green-100 text-green-700',
	},
	{ value: 'theory', label: 'Theory', color: 'bg-blue-100 text-blue-700' },
	{
		value: 'mission',
		label: 'Mission',
		color: 'bg-purple-100 text-purple-700',
	},
	{
		value: 'reminder',
		label: 'Reminder',
		color: 'bg-yellow-100 text-yellow-700',
	},
	{
		value: 'final_review',
		label: 'Final Review',
		color: 'bg-red-100 text-red-700',
	},
];
const MOOD_OPTIONS = ['😊', '😢', '😤', '🎮', '🔥', '😴', '🤔', '❤️'];
const MAX_CHARS = 5000;

export const JournalEditor = ({ onSave, onCancel, initialData = null }) => {
	const [text, setText] = useState(initialData?.text || '');
	const [tag, setTag] = useState(initialData?.tag || 'none');
	const [mood, setMood] = useState(initialData?.mood || '');
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!text.trim()) {
			alert('Please enter some text');
			return;
		}

		if (text.length > MAX_CHARS) {
			alert(`Text must be ${MAX_CHARS} characters or less`);
			return;
		}

		try {
			setSaving(true);
			await onSave({ text: text.trim(), tag, mood });
			// Reset form
			setText('');
			setTag('none');
			setMood('');
		} catch (error) {
			console.error('Error saving entry:', error);
			alert('Failed to save entry');
		} finally {
			setSaving(false);
		}
	};

	const remainingChars = MAX_CHARS - text.length;
	const isOverLimit = remainingChars < 0;

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<form onSubmit={handleSubmit}>
				{/* Text */}
				<div className="mb-4">
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Write your journal entry..."
						className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
							isOverLimit ? 'border-red-500' : 'border-gray-300'
						}`}
						rows={6}
					/>
					<div
						className={`text-sm text-right mt-1 ${
							isOverLimit ? 'text-red-500' : 'text-gray-500'
						}`}>
						{remainingChars} characters remaining
					</div>
				</div>

				{/* Tags */}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tag (optional)
					</label>
					<div className="flex flex-wrap gap-2">
						{TAG_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => setTag(option.value)}
								className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
									tag === option.value
										? option.color + ' ring-2 ring-offset-2 ring-teal-500'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
								}`}>
								{option.label}
							</button>
						))}
					</div>
				</div>

				{/* Mood  */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Mood (optional)
					</label>
					<div className="flex flex-wrap gap-2">
						{MOOD_OPTIONS.map((emoji) => (
							<button
								key={emoji}
								type="button"
								onClick={() => setMood(mood === emoji ? '' : emoji)}
								className={`w-10 h-10 text-2xl rounded-lg transition ${
									mood === emoji
										? 'bg-teal-100 ring-2 ring-teal-500'
										: 'bg-gray-100 hover:bg-gray-200'
								}`}>
								{emoji}
							</button>
						))}
						{mood && (
							<button
								type="button"
								onClick={() => setMood('')}
								className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
								Clear
							</button>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={saving}
						className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
						Cancel
					</button>
					<button
						type="submit"
						disabled={saving || !text.trim() || isOverLimit}
						className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
						{saving ? 'Saving...' : initialData ? 'Update Entry' : 'Save Entry'}
					</button>
				</div>
			</form>
		</div>
	);
};
