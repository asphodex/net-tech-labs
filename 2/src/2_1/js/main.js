document.addEventListener("DOMContentLoaded", function() {
    const svg = d3.select("svg")


    // Forms & Toggles

    // toggles
    const animToggle = document.getElementById('animToggle');
    const pathMoveToggle = document.getElementById('pathMoveToggle');

    // draw
    const dataForm = document.getElementById('setting');
    
    // anim
    const dataAnimForm = document.getElementById('settingAnim');
    const animType = document.getElementById('animType');

    // pathmove
    const pathMoveText = document.getElementById('pathMoveText');

    // settings forms
    const settingsAnim_PathMove = document.getElementById('settingsAnim_PathMove');
    const settingsAnim_Coords = document.getElementById('settingsAnim_Coords');
    const settingsAnim_Scale = document.getElementById('settingsAnim_Scale');
    const settingsAnim_Rotate = document.getElementById('settingsAnim_Rotate');

    animToggle.addEventListener('change', () => {
        const isAnim = animToggle.checked;
        
        // drawmode choice
        dataForm.hidden = isAnim;
        
        // animmode choice
        dataAnimForm.hidden = !isAnim;
        animType.hidden = !isAnim;
        pathMoveText.hidden = !isAnim;
    });

    pathMoveToggle.addEventListener('change', () => {
        const isPathMove = pathMoveToggle.checked;

        // pathmovemode choice
        settingsAnim_PathMove.hidden = !isPathMove;
        settingsAnim_Coords.hidden = isPathMove;
        settingsAnim_Scale.hidden = isPathMove;
        settingsAnim_Rotate.hidden = isPathMove;
    });

    // buttons

    const drawBtn = document.getElementById("drawBtn");
    const animateBtn = document.getElementById("animateBtn");
    const clearButtons = document.querySelectorAll("#clearBtn");

    // draw
    drawBtn.addEventListener('click', () => {
        draw(dataForm, svg);
    })

    // animate
    animateBtn.addEventListener('click', () => {
        const isPathMove = pathMoveToggle.checked;
        runAnimation(dataAnimForm, animType, isPathMove);
    })

    // clear
    clearButtons.forEach((button) => {
        button.addEventListener('click', () => {
            svg.selectAll('*').remove();
        });
    });
})

const draw = (dataForm, svg) => {
    let pict = drawSmile(svg);

    const cx = dataForm.cx.value;
    const cy = dataForm.cy.value;

    const sx = dataForm.sx.value;
    const sy = dataForm.sy.value;

    const angle = dataForm.angle.value;

    pict.attr("transform", `translate(${cx}, ${cy}) scale(${sx}, ${sy}) rotate(${angle})`);
}

const runAnimation = (dataForm, animType, isPathMove) => {
    const svg = d3.select("svg")
    let pict = drawSmile(svg);
        
    const selectedType = animType.value;

    let easeFunction;
    if (selectedType === "linear")
        easeFunction = d3.easeLinear;
    else if (selectedType === "elastic") 
        easeFunction = d3.easeElastic;
    else
        easeFunction = d3.easeBounce;

    if (!isPathMove) {  

        pict.attr("transform", `translate(${dataForm.cx_from.value}, ${dataForm.cy_from.value}) ` +
                `scale(${dataForm.sx_from.value}, ${dataForm.sy_from.value}) ` +
                `rotate(${dataForm.angle_from.value}) `) 
            .transition(svg)
            .duration(6000)
            .ease(easeFunction)
            .attr("transform", `translate(${dataForm.cx_to.value}, ${dataForm.cy_to.value}) ` +
                `scale(${dataForm.sx_to.value}, ${dataForm.sy_to.value}) ` +
                `rotate(${dataForm.angle_to.value}) `);
    } else {
        const pathMoveType = document.getElementById('pathMoveType');

        let path = drawPath(pathMoveType.value);
        
        pict.transition()
            .ease(easeFunction)
            .duration(6000)
            .attrTween('transform', translateAlong(path.node()));
    }
}