var YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

var RESULTS_TEMPLATE = 
	'<div class="display">\
		<a class="img-link" href="" target="_blank">\
			<img src="">\
		</a>\
		<a class="more-link" href="" target="_blank">more..</a>\
	</div>';

var PREV_PAGE_TEMPLATE = '<button class="prev-page"></button>';

var NEXT_PAGE_TEMPLATE = '<button class="next-page"></button>';

var prevPageToken;
var nextPageToken;

function getDataFromAPI(searchTerm, pageTokenValue, callBack){
	var query ={
		q: `${searchTerm} in:name`,
		part: 'snippet',
		key: 'AIzaSyBERGANqxpkXtGEJR1XIMOvqfdAQczTPXA',
		pageToken: pageTokenValue		
	}
	return $.getJSON(YOUTUBE_SEARCH_URL, query, callBack);
}

function renderImg(item){
	var element = $(RESULTS_TEMPLATE);

	var img = element.find('img');
	img.attr('src', item.snippet.thumbnails.medium.url);

	var imgLink = element.find('.img-link');
	imgLink.attr('href', 'https://www.youtube.com/watch?v=' + item.id.videoId);

	var moreLink = element.find('.more-link');
	moreLink.attr('href', 'https://www.youtube.com/channel/' + item.snippet.channelId);

	return element;
}

function handleData(data){
	var results = [];
	results.push($(PREV_PAGE_TEMPLATE).text('Prev'));
	results.push($(NEXT_PAGE_TEMPLATE).text('Next'));	
	data.items.forEach((item, index) => {
		results.push(renderImg(item));
	});

    prevPageToken = data.prevPageToken;
    nextPageToken = data.nextPageToken;

	$('.js-search-results').html(results);
}


function search(){
	var searchTerm;

	$('.js-form').submit(event => {
		event.preventDefault();
		var input = $(this).find('#js-query');
		searchTerm = input.val();
		input.val('');

		getDataFromAPI(searchTerm, '', handleData);
	});

	$('main').on('click', '.prev-page', event => {
		getDataFromAPI(searchTerm, prevPageToken, handleData);
	})

	$('main').on('click', '.next-page', event => {
		getDataFromAPI(searchTerm, nextPageToken, handleData);
	})
};

$(search);