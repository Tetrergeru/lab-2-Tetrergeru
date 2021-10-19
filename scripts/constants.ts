const taskCreator = `
<div class="task-creator">
<div class="task-creator__button">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd" d="M8 0C8.55229 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55229 15.5523 9 15 9H9V15C9 15.5523 8.55229 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55229 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z"
    fill="#A5A5A5"
  />
  </svg></div>
<input class="task-creator__text" type="text" placeholder="What's next" />
</div>
`

const containerWithSomeTasks = `
<div class="gauge">
<div class="gauge__average">
  <svg viewBox="0 0 120 120" class="gauge__cirlce" fill="none" stroke-width="2">
    <circle class="gauge__cirlce-base" r="53" cx="60" cy="60"></circle>
    <circle class="gauge__cirlce-arc" r="53" cx="60" cy="60" transform="rotate(-90 60 60)"
      stroke-dashoffset="0" stroke-dasharray="1 329">
    </circle>
  </svg>
</div>
<div class="gauge__percent">
  <div class="gauge__percent_box">
    <div class="gauge__percent_value"></div>
    <div class="gauge__percent_symbol">%</div>
  </div>
</div>
</div>

<div class="tasks-left"></div>

<div class="task-container">
  ${taskCreator}
</div>
`

const containerWithNoTasks = `
<embed src="/images/NoTask.svg">

<div class="to-do">
  <div class="to-do__whazzup">
    What's up?
  </div>

  <div class="to-do__question">
    What do you want to do today?
  </div>
</div>

<div class="to-do__task-creator">
  ${taskCreator}
</div>
`

const containerWithAllDone = `
<embed src="/images/AllDone.svg">

<div class="to-do">
  <div class="to-do__whazzup">
    All done!
  </div>

  <div class="to-do__question">
    Have a party or go for a walk!
  </div>
</div>

<div class="to-do__task-creator">
  ${taskCreator}
</div>
` 

const svgOk = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
<path 
    fill-rule="evenodd" 
    clip-rule="evenodd"
    d="M3.91006 7.49585L1.7071 5.29291C1.31658 4.90239 0.683416 4.90239 0.292893 5.29291C-0.0976309 5.68343 -0.0976309 6.3166 0.292893 6.70712L3.29288 9.70709C3.7168 10.131 4.4159 10.0892 4.7863 9.61781L11.7863 1.61786C12.1275 1.18359 12.0521 0.554936 11.6178 0.213723C11.1835 -0.127489 10.5549 -0.0520504 10.2136 0.38222L3.91006 7.49585Z"
    fill="#A5A5A5"
/>
</svg>`

const svgCross = `
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
<path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M7.41401 6L11.707 1.707C12.098 1.316 12.098 0.683998 11.707 0.292998C11.316 -0.0980018 10.684 -0.0980018 10.293 0.292998L6.00001 4.586L1.70701 0.292998C1.31601 -0.0980018 0.684006 -0.0980018 0.293006 0.292998C-0.0979941 0.683998 -0.0979941 1.316 0.293006 1.707L4.58601 6L0.293006 10.293C-0.0979941 10.684 -0.0979941 11.316 0.293006 11.707C0.488006 11.902 0.744006 12 1.00001 12C1.25601 12 1.51201 11.902 1.70701 11.707L6.00001 7.414L10.293 11.707C10.488 11.902 10.744 12 11 12C11.256 12 11.512 11.902 11.707 11.707C12.098 11.316 12.098 10.684 11.707 10.293L7.41401 6Z"
    fill="#A5A5A5"
/>
</svg>`

const svgPlus = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path
    fill-rule="evenodd"
    clip-rule="evenodd" d="M8 0C8.55229 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55229 15.5523 9 15 9H9V15C9 15.5523 8.55229 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55229 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z"
    fill="#A5A5A5"
/>
</svg>`