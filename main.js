const { program } = require('commander');
const questions = require('./questions.json');
const fs = require('fs')
const { default: inquirer } = require('inquirer');
const moment = require('moment');

const getQuestion = () => {
    return questions.questions[
        Math.floor(
            Math.random() * questions.questions.length)
    ]
}

const captureAnswer = (message, answer) => {
    const now = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')
    return `
    "${now}":[
        {
            "${message}": "${answer.response}"\n
        }
    ]`
}

program.version("0.0.1").description("A simple cli tool to answer interview questions")
    .action(async () => {

        const message = getQuestion();
        const output = 'answers.json';

        const answer = await inquirer.prompt(
            {
                type: 'input',
                name: 'response',
                message
            }
        );

        if (fs.existsSync(output)) {
            const contents = fs.readFileSync(output)
            previous = JSON.stringify(JSON.parse(contents), null, '\t')
            // console.log(previous[0], previous[previous.length - 1])
            rest = previous.slice(1, previous.length - 1)
            console.log(rest)
            captureAnswer(message, answer, output)
            next = (rest.length > 0) ? `{
    ${captureAnswer(message, answer, output)},
    ${rest}
}` : `{
    ${captureAnswer(message, answer, output)}
}`
            fs.writeFileSync(output, next)
        } else {
            fs.writeFileSync(output, `{
    ${captureAnswer(message, answer, output)}
}`)
        }

    })

program.parse(process.argv)