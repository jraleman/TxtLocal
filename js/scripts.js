// https://github.com/nhn/tui.editor/issues/1637
// https://github.com/nhn/tui.editor/issues/360

const title = 'This is an idea of what we can do...';

const content = `# ${title}

## Chapter 1 - What do I do?

> Hello everyone, concerned Christian Father here.
> Recently my 11 year old son downloaded the video game Fortnite after playing it at a friend’s house.
> While I didn’t mind it at first, it soon began affect his character.
> Within a week he had taken up semi-pro Fortnite dancing competitions.
> When asked to do his homework, he called me a “default” and did a strange pose with his arms extended outwards.
> His grades have been dropping heavily ever since that day and when I confront him about it he threatens to “one pump” me.
> He refuses to eat his favourite foods anymore and constantly demands a “chug jug”.
> Now he has dyed his hair the colour blue as a way to “promote” his idol “Ninja” and refers to me and my wife as “little craps”.
> I try to get him to go to bible studies now but he just tells me to jump out of the “battle bus” without a glider.

> **Please help!!!**
`;

const editor = new toastui.Editor({
    el: document.querySelector('#editor'),
    previewStyle: 'vertical',
    height: '500px',
    initialValue: content,
    initialEditType: 'wysiwyg'
});

// https://stackoverflow.com/a/30832210
// TODO: save into a .zip file, containing also git changes of that file
// So we can load from that point... We could also save snapshots of the diffs and create
// the commits from there? idk...
const saveLocalFile = (blob, filename) => {
    const file = blob;
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
    return file;
}

const onSave = (event) => {
    event.preventDefault();
    const bodyContent = editor.getMarkdown();
    const file = document.getElementById('doc-title').value;
    const extension = '.md';
    const filename = `${file || 'filename'}${extension}`;
    const blob = new Blob([bodyContent], {type: 'text/plain;charset=utf-8'});
    window.alert('Hint: Open dev tools!');
    console.log(
        'This is an idea of what we can send to the backend:',
        '\n\n',
        `
{
    title: '  GET FROM FIRST LINE OF BODY CONTENT '
    filename: ${filename},
    blob: ${blob},
    body: 
    """
        ${bodyContent}
    """
    ,
}
        `
    );
    // TODO: Implement function to save file -> sendToBackend(blob, filename, ...);

    const saveLocal = document.getElementById('save-local').checked;
    if (saveLocal) {
        saveLocalFile(blob, filename);
    }
};

const populateDropdown = () => {
    const dropdown = document.getElementById('dropdown');
    if (dropdown.innerHTML) {
        return;
    }

    const json = { 'data': [`${title} - 4`, `${title} - 3`, `${title} - 2`, `${title} - 1`] };
    for (let i = 0; i < json.data.length; i += 1) {
        const option = document.createElement('option');
        option.text = json.data[i];
        option.value = json.data[i];
        dropdown.add(option);
    }
    return dropdown;
};

const setTitle = () => {
    const titleInput = document.getElementById('doc-title');
    titleInput.value = title;
};

const runOnLoad = () => {
    setTitle();
};

document.onload = runOnLoad();
