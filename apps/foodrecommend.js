var fs = require('fs');
var SlackBot = require('slackbots');

function random_number(min_num, max_num)
{
	var no = parseInt(Math.random() * max_num);
	if( no < min_num || no > max_num ) {
		return random_number();
	} else {
		return no;
	}
}

function pick_number(cnt_num, min_num, max_num)
{
	var no = new Array();
	var tmp_num, i = 0;

	var tmp_arr = [];

	while(no.length < cnt_num) {
		tmp_num = random_number(min_num, max_num); 
		for(i = 0; i < no.length; i++) {
			if(no[i] == tmp_num) {
				break;
			}
		}
		if(i == no.length) {
  			no[i] = tmp_num;
  			tmp_arr.push(tmp_num);
  		}
	}
	return tmp_arr;
}


function readFoodDataFromFile(file_name) {
	var data = fs.readFileSync(file_name, 'utf-8');
	var food_data = data.split('\n');
	return food_data;
}

function generateFoodRecommand(food_data, num) {
	var food_nums = pick_number(5, 0, food_data.length - 1);
	var output_str = "";
	food_nums.forEach(function (n) {
		output_str += food_data[n] + "\n";
	});

	return output_str;
}


var food_filename = 'foodList.txt';
var food_data = readFoodDataFromFile(food_filename);

// create a bot
var slackToken = fs.readFileSync('.slacktoken', 'utf-8');
var bot = new SlackBot({
	token: slackToken,
	name: 'Food Bot'
});
var botParams = {
	icon_emoji: ':cat:'
};

bot.on('message', function(data) {
	console.log(data);
	console.log();
	if (data.type == 'message' && data.text == "food!!") {
		bot.postMessage(data.channel, generateFoodRecommand(food_data, 5), botParams)
		.fail(function(data) {
			console.log("failed " + data);
		})
	}
});

