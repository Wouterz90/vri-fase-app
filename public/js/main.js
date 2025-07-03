console.log("Script geladen");

function send() {
      fetch('/api/update-bar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: '001', start: 30, end: 50 })
      })
      .then(res => res.json())
      .then(data => alert('Server zegt: ' + data.status));
    }

const timelineWidth = 100; // Percent

  function updateBars(row) {
    const startInput = row.querySelector('.start');
    const endInput = row.querySelector('.end');
    const green = row.querySelector('.bar.green');
    const yellow = row.querySelector('.bar.yellow');

    let start = parseFloat(startInput.value);
    let end = parseFloat(endInput.value);
    if (end < start) [start, end] = [end, start];

    const greenWidth = end - start;
    green.style.left = `${start}%`;
    green.style.width = `${greenWidth}%`;

    yellow.style.left = `${end}%`;
    yellow.style.width = `2%`;

    // update rode lijnen
    const leftGap = row.querySelector('.left-gap');
    const middleGap = row.querySelector('.middle-gap');
    const rightGap = row.querySelector('.right-gap');

    // segment 1: van 0% tot start
    leftGap.style.left = `0%`;
    leftGap.style.width = `${start}%`;

    // segment 2: tussen end en end+2 (begin van geel) tot geel einde
    middleGap.style.left = `${start + (end - start)}%`;
    middleGap.style.width = `2%`; // of eventueel 0 als geel te smal is

    // segment 3: vanaf geel einde tot 100%
    rightGap.style.left = `${end + 2}%`;
    rightGap.style.width = `${100 - (end + 2)}%`;
  }

function enableDragging(row) {
  const green = row.querySelector('.bar.green');
  const startInput = row.querySelector('.start');
  const endInput = row.querySelector('.end');

  let dragType = null;
  let startX = 0;
  let originalStart = 0;
  let originalEnd = 0;

  function onMouseDown(e) {
    if (e.target.classList.contains('handle')) {
      dragType = e.target.classList.contains('left') ? 'resize-left' : 'resize-right';
    } else {
      dragType = 'move';
    }

    startX = e.clientX;
    originalStart = parseFloat(startInput.value);
    originalEnd = parseFloat(endInput.value);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    const deltaPixels = e.clientX - startX;
    const timeline = row.querySelector('.timeline');
    const timelinePixels = timeline.offsetWidth;
    const deltaPercent = (deltaPixels / timelinePixels) * 100;

    let newStart = originalStart;
    let newEnd = originalEnd;

    if (dragType === 'move') {
      newStart = Math.max(0, Math.min(100, originalStart + deltaPercent));
      newEnd = Math.max(0, Math.min(100, originalEnd + deltaPercent));
    } else if (dragType === 'resize-left') {
      newStart = Math.max(0, Math.min(originalEnd, originalStart + deltaPercent));
    } else if (dragType === 'resize-right') {
      newEnd = Math.max(originalStart, Math.min(100, originalEnd + deltaPercent));
    }

    startInput.value = newStart.toFixed(1);
    endInput.value = newEnd.toFixed(1);
    updateBars(row);
  }

  function onMouseUp() {
    dragType = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  green.addEventListener('mousedown', onMouseDown);
}

document.querySelectorAll('tr[data-id]').forEach(row => {
  // init
  updateBars(row);
  enableDragging(row);

  // input listeners
  row.querySelectorAll('.start, .end').forEach(input => {
    input.addEventListener('input', () => updateBars(row));
  });
});