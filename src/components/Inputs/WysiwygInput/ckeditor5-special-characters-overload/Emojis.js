var emojisList = [
	{ title: 'grinning face', character: '😀' },
	{ title: 'grinning face with sweat', character: '😅' },
	{ title: 'slightly smiling face', character: '🙂' },
	{ title: 'winking face', character: '😉' },
	{ title: 'smiling face with halo', character: '😇' },
	{ title: 'smiling face with heart-eyes', character: '😍' },
	{ title: 'face blowing a kiss', character: '😘' },
	{ title: 'face savoring food', character: '😋' },
	{ title: 'winking face with tongue', character: '😜' },
	{ title: 'money-mouth face', character: '🤑' },
	{ title: 'hugging face', character: '🤗' },
	{ title: 'face with hand over mouth', character: '🤭' },
	{ title: 'thinking face', character: '🤔' },
	{ title: 'face with raised eyebrow', character: '🤨' },
	{ title: 'neutral face', character: '😐' },
	{ title: 'face without mouth', character: '😶' },
	{ title: 'smirking face', character: '😏' },
	{ title: 'unamused face', character: '😒' },
	{ title: 'face with rolling eyes', character: '🙄' },
	{ title: 'sleeping face', character: '😴' },
	{ title: 'face with medical mask', character: '😷' },
	{ title: 'face with thermometer', character: '🤒' },
	{ title: 'face with head-bandage', character: '🤕' },
	{ title: 'nauseated face', character: '🤢' },
	{ title: 'hot face', character: '🥵' },
	{ title: 'cold face', character: '🥶' },
	{ title: 'woozy face', character: '🥴' },
	{ title: 'cowboy hat face', character: '🤠' },
	{ title: 'partying face', character: '🥳' },
	{ title: 'smiling face with sunglasses', character: '😎' },
	{ title: 'nerd face', character: '🤓' },
	{ title: 'confused face', character: '😕' },
	{ title: 'worried face', character: '😟' },
	{ title: 'face with open mouth', character: '😮' },
	{ title: 'fearful face', character: '😨' },
	{ title: 'crying face', character: '😢' },
	{ title: 'loudly crying face', character: '😭' },
	{ title: 'face screaming in fear', character: '😱' },
	{ title: 'disappointed face', character: '😞' },
	{ title: 'downcast face with sweat', character: '😓' },
	{ title: 'pouting face', character: '😡' },
	{ title: 'angry face', character: '😠' },
	{ title: 'love letter', character: '💌' },
	{ title: 'growing heart', character: '💗' },
	{ title: 'two hearts', character: '💕' },
	{ title: 'broken heart', character: '💔' },
	{ title: 'orange heart', character: '🧡' },
	{ title: 'yellow heart', character: '💛' },
	{ title: 'green heart', character: '💚' },
	{ title: 'blue heart', character: '💙' },
	{ title: 'purple heart', character: '💜' },
	{ title: 'brown heart', character: '🤎' },
	{ title: 'black heart', character: '🖤' },
	{ title: 'white heart', character: '🤍' },
	{ title: 'hundred points', character: '💯' },
	{ title: 'anger symbol', character: '💢' },
	{ title: 'collision', character: '💥' },
	{ title: 'speech balloon', character: '💬' },
	{ title: 'eye in speech bubble', character: '👁️‍🗨️' },
	{ title: 'thought balloon', character: '💭' },
	{ title: 'zzz', character: '💤' },
	{ title: 'waving hand', character: '👋' },
	{ title: 'raised back of hand', character: '🤚' },
	{ title: 'hand with fingers splayed', character: '🖐' },
	{ title: 'OK hand', character: '👌' },
	{ title: 'pinching hand', character: '🤏' },
	{ title: 'victory hand', character: '✌' },
	{ title: 'love-you gesture', character: '🤟' },
	{ title: 'call me hand', character: '🤙' },
	{ title: 'backhand index pointing left', character: '👈' },
	{ title: 'backhand index pointing right', character: '👉' },
	{ title: 'backhand index pointing up', character: '👆' },
	{ title: 'backhand index pointing down', character: '👇' },
	{ title: 'thumbs up', character: '👍' },
	{ title: 'thumbs down', character: '👎' },
	{ title: 'clapping hands', character: '👏' },
	{ title: 'raising hands', character: '🙌' },
	{ title: 'folded hands', character: '🙏' },
	{ title: 'flexed biceps', character: '💪' },
	{ title: 'man', character: '👨' },
	{ title: 'woman', character: '👩' },
	{ title: 'woman: red hair', character: '👩‍🦰' },
	{ title: 'person: red hair', character: '🧑‍🦰' },
	{ title: 'woman: curly hair', character: '👩‍🦱' },
	{ title: 'person: curly hair', character: '🧑‍🦱' },
	{ title: 'woman: white hair', character: '👩‍🦳' },
	{ title: 'person: white hair', character: '🧑‍🦳' },
	{ title: 'woman: bald', character: '👩‍🦲' },
	{ title: 'person: bald', character: '🧑‍🦲' },
	{ title: 'woman: blond hair', character: '👱‍♀️' },
	{ title: 'man: blond hair', character: '👱‍♂️' },
	{ title: 'older person', character: '🧓' },
	{ title: 'old man', character: '👴' },
	{ title: 'old woman', character: '👵' },
	{ title: 'man tipping hand', character: '💁‍♂️' },
	{ title: 'woman tipping hand', character: '💁‍♀️' },
	{ title: 'man raising hand', character: '🙋‍♂️' },
	{ title: 'woman raising hand', character: '🙋‍♀️' },
	{ title: 'man facepalming', character: '🤦‍♂️' },
	{ title: 'woman facepalming', character: '🤦‍♀️' },
	{ title: 'lion', character: '🦁' },
	{ title: 'compass', character: '🧭' },
	{ title: 'house', character: '🏠' },
	{ title: 'rocket', character: '🚀' },
	{ title: 'hourglass not done', character: '⏳' },
	{ title: 'watch', character: '⌚' },
	{ title: 'alarm clock', character: '⏰' },
	{ title: 'stopwatch', character: '⏱' },
	{ title: 'star', character: '⭐' },
	{ title: 'high voltage', character: '⚡' },
	{ title: 'fire', character: '🔥' },
	{ title: 'party popper', character: '🎉' },
	{ title: 'wrapped gift', character: '🎁' },
	{ title: 'trophy', character: '🏆' },
	{ title: 'sports medal', character: '🏅' },
	{ title: '1st place medal', character: '🥇' },
	{ title: '2nd place medal', character: '🥈' },
	{ title: '3rd place medal', character: '🥉' },
	{ title: 'muted speaker', character: '🔇' },
	{ title: 'speaker low volume', character: '🔈' },
	{ title: 'speaker medium volume', character: '🔉' },
	{ title: 'speaker high volume', character: '🔊' },
	{ title: 'loudspeaker', character: '📢' },
	{ title: 'megaphone', character: '📣' },
	{ title: 'bell', character: '🔔' },
	{ title: 'microphone', character: '🎤' },
	{ title: 'mobile phone', character: '📱' },
	{ title: 'battery', character: '🔋' },
	{ title: 'laptop', character: '💻' },
	{ title: 'desktop computer', character: '🖥️' },
	{ title: 'movie camera', character: '🎥' },
	{ title: 'clapper board', character: '🎬' },
	{ title: 'magnifying glass tilted left', character: '🔍' },
	{ title: 'magnifying glass tilted right', character: '🔎' },
	{ title: 'light bulb', character: '💡' },
	{ title: 'page facing up', character: '📄' },
	{ title: 'envelope', character: '✉️' },
	{ title: 'e-mail', character: '📧' },
	{ title: 'package', character: '📦' },
	{ title: 'pen', character: '🖊️' },
	{ title: 'memo', character: '📝' },
	{ title: 'file folder', character: '📁' },
	{ title: 'tear-off calendar', character: '📆' },
	{ title: 'chart increasing', character: '📈' },
	{ title: 'chart decreasing', character: '📉' },
	{ title: 'bar chart', character: '📊' },
	{ title: 'clipboard', character: '📋' },
	{ title: 'pushpin', character: '📌' },
	{ title: 'round pushpin', character: '📍' },
	{ title: 'scissors', character: '✂️' },
	{ title: 'locked', character: '🔒' },
	{ title: 'unlocked', character: '🔓' },
	{ title: 'key', character: '🔑' },
	{ title: 'warning', character: '⚠️' },
	{ title: 'no entry', character: '⛔' },
	{ title: 'prohibited', character: '🚫' },
	{ title: 'female sign', character: '♀️' },
	{ title: 'male sign', character: '♂' },
	{ title: 'check mark', character: '✔️' },
	{ title: 'cross mark', character: '❌' },
	{ title: 'red circle', character: '🔴' },
	{ title: 'orange circle', character: '🟠' },
	{ title: 'yellow circle', character: '🟡' },
	{ title: 'green circle', character: '🟢' },
	{ title: 'blue circle', character: '🔵' },
	{ title: 'purple circle', character: '🟣' },
	{ title: 'brown circle', character: '🟤' },
	{ title: 'black circle', character: '⚫' },
	{ title: 'white circle', character: '⚪' },
	{ title: 'red square', character: '🟥' },
	{ title: 'orange square', character: '🟧' },
	{ title: 'yellow square', character: '🟨' },
	{ title: 'green square', character: '🟩' },
	{ title: 'blue square', character: '🟦' },
	{ title: 'purple square', character: '🟪' },
	{ title: 'brown square', character: '🟫' },
	{ title: 'black large square', character: '⬛' },
	{ title: 'white large square', character: '⬜' },
];

export default emojisList;