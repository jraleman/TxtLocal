const onSave = (event) => {
    event.preventDefault();
    const bodyContent = document.getElementById('body-content').innerHTML;
    const file = document.getElementById('file-name').innerHTML;
    const extension = '.md';
    const filename = `${file || 'filename'}${extension}`;
    const blob = new Blob([bodyContent], {type: 'text/plain;charset=utf-8'});
    window.alert('Open dev tools!');
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
    )
    // TODO: Implement function to save file -> sendToBackend(blob, filename, ...);
};
