module.exports = ()=>{
    const d = new Date()
    return (d.getMonth()+"").padStart(2,"0")+"/"+(d.getDate() +"").padStart(2,"0")+"/"+d.getFullYear()
}
