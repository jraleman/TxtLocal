// https://github.com/nhn/tui.editor/issues/1637
// https://github.com/nhn/tui.editor/issues/360

// ----------------------------------------------------
// Mocked data:
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

// TODO: find a way to get line selected from [m..n]
const content4 = `${content.split('\n').join()}`;
const content3 = `${content4.split('\n').join()}`;
const content2 = `${content3.split('\n').join()}`;
const content1 = `${content2.split('\n').join()}`;

const jsonResponse = { 
    data: [
        { id: 4, title: `${title} - v4`, content4 },
        { id: 3, title: `${title} - v3`, content3 },
        { id: 2, title: `${title} - v2`, content2 },
        { id: 1, title: `${title} - v1`, content1 },
    ]
};

// ----------------------------------------------------

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

    for (let i = 0; i < jsonResponse.data.length; i += 1) {
        const option = document.createElement('option');
        option.text = jsonResponse.data[i].title;
        option.value = jsonResponse.data[i].title;
        option.id = jsonResponse.data[i].id;
        dropdown.add(option);
    }
    return dropdown;
};

const onSelectOption = () => {
    for (let i = 0; i < jsonResponse.data.length; i += 1) {
        const id = `${i + 1}`;
        // TODO: check if option is selected
        const option = document.getElementById(id);
        // TODO: load data (content) from option (mock saved file, select from id)
        // Change -> Editor {value} to contentX value...
    }
};

const setTitle = () => {
    const titleInput = document.getElementById('doc-title');
    titleInput.value = title;
};

const runOnLoad = () => {
    setTitle();
};

document.onload = runOnLoad();
