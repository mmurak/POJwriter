// syllable -> regularisedSyllable
function regularise(syllable) {
	var rValue = '';
	if (syllable.match(/\D$/))		// if there is no tone identifier, use '1' (for sentinel)
		syllable = syllable + '1';
	if (syllable.match(/^([bcdfghjklmnpqrstvwxyz]*)(\D*)(\d)(.*)/i)) {
		var head, body, tone, rest;
		initial = RegExp.$1;
		body = RegExp.$2;
		tone = RegExp.$3;
		rest = RegExp.$4;
		if (rest != '') {			// which is not a target
			return rValue;
		}
		if ((tone == '1') || (tone == '4') || (tone == '6')) {	// tone 1,4,6 shouldn't be specified
			tone = '';
		}
		if (body == '') {		// m or n
			if (initial.match(/(n)(g)/i)) {
				initial = initial.replace(/ng/i, RegExp.$1 + tone + RegExp.$2);
			} else {
				initial = initial.replace(/([mn])/i, '$&' + tone);
			}
			rValue = initial + body;
		} else if (body in dTable) {
			var ch = body.split('');
			var pos = dTable[body];
			ch[pos] = ch[pos] + tone;
			rValue = initial + ch.join('');
		}
	}
	return rValue;
}

// line -> (token, delimiter, rest)
//     if EOL then token should be ''
function syllableTokenizer(line) {
	var rValue = [];
	line = line + ' '		// Sentinel
	if (line.match(/^([^\s\-\.\,\?;]+)([\s\-\.\,\?;]+)([\s\S]*)/))  {
		var rest = RegExp.$3;		// Remove sentinel
		rest = rest.slice(0, -1);		//
		rValue.unshift(rest);
		rValue.unshift(RegExp.$2);
		rValue.unshift(RegExp.$1);
	} else {				// there is a preamble ([\s\-\.\,\?])
		line = line.slice(0, -1);	// Remove sentinel
		line.match(/^([\s\-\.\,\?;]+)([\s\S]*)/);
		rValue.unshift(RegExp.$2);		// set rest
		rValue.unshift(RegExp.$1);		// set preamble as delimiter
		rValue.unshift('');						//	set '' to token
	}
	return rValue;
}

function regulariseDiacriticPosition(line) {
	var rValue = '';
	while (true) {
		var token, delimiter, rest;
		var tempArray = syllableTokenizer(line);		// to make Opera happy
		token = tempArray[0];									//
		delimiter = tempArray[1];								//
		rest = tempArray[2];									//
		var partialResult;
		partialResult = regularise(token);
		if (partialResult == '') {
			partialResult = token;
		}
		rValue = rValue + partialResult + delimiter;
		if (rest == '')			// exit point of loop
			break;
		line = rest;
	}
	return rValue;
}

dTable = {
'a': 0,
'a^': 0,
'ann': 0,
'ah': 0,
'ah^': 0,
'annh': 0,
'ai': 0,
'ai^': 0,
'ainn': 0,
'ak': 0,
'am': 0,
'an': 0,
'ang': 0,
'ap': 0,
'at': 0,
'au': 0,
'auh': 0,
'e': 0,
'e^': 0,
'enn': 0,
'eh': 0,
'eh^': 0,
'ennh': 0,
'ek': 0,
'eng': 0,
'i': 0,
'i^': 0,
'inn': 0,
'ia': 1,
'ia^': 1,
'iann': 1,
'iah': 1,
'iah^': 1,
'iannh': 1,
'iak': 1,
'iam': 1,
'ian': 1,
'iang': 1,
'iap': 1,
'iat': 1,
'iau': 1,
'iau^': 1,
'iaunn': 1,
'iauh': 1,
'ih': 0,
'ik': 0,
'im': 0,
'in': 0,
'ing': 0,
'io': 1,
'ioh': 1,
'iok': 1,
'iong': 1,
'ip': 0,
'it': 0,
'iu': 1,
'iu^': 1,
'iunn': 1,
'iuh^': 1,
'iunnh': 1,
'm': 0,
'mh': 0,
'ng': 0,
'ngh': 0,
'o': 0,
'o^': 0,
'onn': 0,
'ou': 1,
'oo': 0,
'oa': 0,
'oa^': 0,
'oah': 0,
'oai': 1,
'oai^': 1,
'oan': 1,
'oang': 1,
'oat': 0,
'oe': 0,
'oeh': 0,
'oh': 0,
'ouh': 1,
'ooh': 0,
'oh^': 0,
'onnh': 0,
'ok': 0,
'om': 0,
'om': 0,
'ong': 0,
'u': 0,
'ua': 1,
'uah': 1,
'uai': 1,
'uainn': 1,
'uan': 1,
'uang': 1,
'uann': 1,
'uat': 1,
'ue': 1,
'ueh': 1,
'uh': 0,
'ui': 0,
'un': 0,
'ut': 0,
}
