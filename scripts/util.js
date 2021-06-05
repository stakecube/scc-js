/* chainparams */
const PUBKEY_ADDRESS = 125;
const SCRIPT_ADDRESS = 117;
const SECRET_KEY     = 253;

// ByteToHexString Conversions
function byteToHexString(uint8arr) {
	if (!uint8arr) return '';
	var hexStr = '';
	for (const byte of uint8arr) {
		var hex = (byte & 0xff).toString(16);
		hex = (hex.length === 1) ? '0' + hex : hex;
		hexStr += hex;
	}
	return hexStr.toUpperCase();
}
function hexStringToByte(str) {
	if (!str) return new Uint8Array();
	var a = [];
	for (var i = 0, len = str.length; i < len; i += 2) {
		a.push(parseInt(str.substr(i, 2), 16));
	}
	return new Uint8Array(a);
}

// B58 Encoding Map
var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// B58 Encoding
var to_b58 = function (
	B              // Uint8Array raw byte input
) {
	var d = [],    // the array for storing the stream of base58 digits
		s = "",    // the result string variable that will be returned
		i,         // the iterator variable for the byte input
		j,         // the iterator variable for the base58 digit array (d)
		c,         // the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
		n;         // a temporary placeholder variable for the current base58 digit
	for (i in B) { // loop through each byte in the input stream
		j = 0,                           // reset the base58 digit iterator
			c = B[i];                    // set the initial carry amount equal to the current byte amount
		s += c || s.length ^ i ? "" : 1; // prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
		while (j in d || c) {            // start looping through the digits until there are no more digits and no carry amount
			n = d[j];                    // set the placeholder for the current base58 digit
			n = n ? n * 256 + c : c;     // shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
			c = n / 58 | 0;              // find the new carry amount (floored integer of current digit divided by 58)
			d[j] = n % 58;               // reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
			j++                          // iterate to the next base58 digit
		}
	}
	while (j--)         // since the base58 digits are backwards, loop through them in reverse order
		s += MAP[d[j]]; // lookup the character associated with each base58 digit
	return s            // return the final base58 string
}

// B58 Decoding
var from_b58 = function (
	S              // Base58 encoded string input
) {
	var d = [],    // the array for storing the stream of decoded bytes
		b = [],    // the result byte array that will be returned
		i,         // the iterator variable for the base58 string
		j,         // the iterator variable for the byte array (d)
		c,         // the carry amount variable that is used to overflow from the current byte to the next byte
		n;         // a temporary placeholder variable for the current byte
	for (i in S) { // loop through each base58 character in the input string
		j = 0,                             // reset the byte iterator
			c = MAP.indexOf(S[i]);           // set the initial carry amount equal to the current base58 digit
		if (c < 0)                         // see if the base58 digit lookup is invalid (-1)
			return undefined;              // if invalid base58 digit, bail out and return undefined
		c || b.length ^ i ? i : b.push(0); // prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
		while (j in d || c) {              // start looping through the bytes until there are no more bytes and no carry amount
			n = d[j];                      // set the placeholder for the current byte
			n = n ? n * 58 + c : c;        // shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
			c = n >> 8;                    // find the new carry amount (1-byte shift of current byte value)
			d[j] = n % 256;                // reset the current byte to the remainder (the carry amount will pass on the overflow)
			j++                            // iterate to the next byte
		}
	}
	while (j--)               // since the byte array is backwards, loop through it in reverse order
		b.push(d[j]);         // append each byte to the result
	return new Uint8Array(b)  // return the final byte array in Uint8Array format
}

// Constants
exports.PUBKEY_ADDRESS = PUBKEY_ADDRESS;
exports.SCRIPT_ADDRESS = SCRIPT_ADDRESS;
exports.SECRET_KEY     = SECRET_KEY;
// Functions
exports.byteToHexString = byteToHexString;
exports.hexStringToByte = hexStringToByte;
exports.to_b58          = to_b58;
exports.from_b58        = from_b58;