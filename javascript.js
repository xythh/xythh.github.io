function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function restore_all() {
    var rows = document.getElementsByClassName('rows');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display === 'table-row') {
            rows[i].innerHTML = rows[i].innerHTML.replace(/<span class="term">(.*?)<\/span>/, '$1');
        } else {
            rows[i].style.display = 'table-row';
            rows[i].innerHTML = rows[i].innerHTML.replace(/<span class="term">(.*?)<\/span>/, '$1');

        }
    }
	restore_hidden('verbs' , 'adjectives' , 'nouns')
}
function restore_hidden() {
	for (var i = 0; i < arguments.length; i++) {
	    if (document.getElementById(arguments[i]).checked == false) {
		    hideElement(arguments[i]);
		}
	}
}



function search() {
    var query = document.getElementById('narrow').value;
    if (/[\uff01-\uff5e]/.test(query)) {
        return;
    }
    var query = query.replace(/”/g, '"');
    if (query === '"') {
        return;
    }

    restore_all();

    var results = document.getElementById('results');

    if (query == '') {
        results.innerHTML = '';
    } else {
        var links = document.getElementsByClassName('links');
	    
        var matches = 0;

        var query = query.replace(/^"/g, '^');
        var query = query.replace(/"$/g, '$');
        var stripped = query.replace(/[\^\$]/g, '');
        var query = query.replace(/[-\/\\*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp(query);
        for (var i = 0; i < links.length; i++) {
            var concept = links[i].innerHTML.replace(/ \(\d\)/g, '');
            if (re.test(concept)) {
                matches += 1;
                links[i].innerHTML = links[i].innerHTML.replace(stripped, '<span class="term">' + stripped + '</span>');
            } else {
                var chichi = document.getElementById('row' + links[i].id);
                chichi.style.display = 'none';
            }
        }

        if (matches === 0) {
            results.innerHTML = 'No results';
        } else if (matches === 1) {
            results.innerHTML = '1 result';
        } else {
            results.innerHTML = matches + ' results';
        }
    }
}

function setElement(listen, element) {
    if (document.getElementById(listen).checked) {
        document.cookie = listen + '_OFF=0; expires=Thu, 18 Dec 2044 12:00:00 UTC';
	    showElement(element); 
    } else {
        document.cookie = listen + '_OFF=1; expires=Thu, 18 Dec 2044 12:00:00 UTC';
	    hideElement(element);
    }
}

function hideElement(element) {
        var links = document.getElementsByClassName('links');
        for (var i = 0; i < links.length; i++) {
        var chichi = document.getElementById('row' + links[i].id);
	if (chichi.children[0].className == element) {
	chichi.style.display = 'none';
	}
	} 
}

function showElement(element) {
        var links = document.getElementsByClassName('links');
        for (var i = 0; i < links.length; i++) {
        var chichi = document.getElementById('row' + links[i].id);
	if (chichi.children[0].className == element) {
	chichi.style.display = 'table-row';
	}
	}
}



function checkCookie(name) {
    var name = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            if (c.substring(name.length, c.length) === '1') {
                return true;
            }
        }
    }
    return false;
}
onload = function() {
    document.getElementById('bloatbox').style.display = 'block';
    document.getElementById('js_hint').style.display = 'inline';
    var e = document.getElementById('narrow');
    e.oninput = search;
    e.onpropertychange = e.oninput;

    var v = document.getElementById('verbs');

    v.onclick = function() {setElement('verbs','verbs')};
    v.onpropertychange = v.oninput;

    var n = document.getElementById('nouns');

    n.onclick = function() {setElement('nouns','nouns')};
    n.onpropertychange = n.oninput;

    var a = document.getElementById('adjectives');

    a.onclick = function() {setElement('adjectives','adjectives')};
    a.onpropertychange = a.oninput;

	if(checkCookie('verbs_OFF')) {
		v.checked = false;
		hideElement('verbs');
	}
	if(checkCookie('nouns_OFF')) {
		n.checked = false;
		hideElement('nouns');
	}
	if(checkCookie('adjectives_OFF')) {
		a.checked = false;
		hideElement('adjectives');
	}

    var toptable = document.getElementById('toptable');
    toptable.addEventListener("click", function(event) {
        if (event.button === 1) {
            return;
        }
        var target = event.target || event.srcElement;
        if (target.className !== 'links') {
            return;
        }

        event.preventDefault();
        var id = target.id;

        var row = document.getElementById('row' + id);
        if (hasClass(row, 'highlighted')) {
            row.className = row.className.replace(/highlighted/, '');
            document.getElementById('entry' + id).innerHTML = '';
            return false;
        }

        var req = new XMLHttpRequest();

        req.open('GET', 'entries/' + id + '.html', false);
        req.send(null);

        if (req.status == 200) {
		console.log(req.responseText);
            var resp = req.responseText.replace(/<html>[\s\S]*?<\/aside>/, '');
		console.log(resp);
            document.getElementById('row' + id).className += ' highlighted';
            document.getElementById('entry' + id).innerHTML = resp;
        }

    });
}
