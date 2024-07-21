/// <reference types='cypress'/>

const baseUrl = 'https://api.tech-global-training.com/instructors'
const studentsBaseURL = 'https://api.tech-global-training.com/students'



describe('TechGlobal Instructor APIs', () => {
    let newStudentId;
    const instructorId = 3; 
    const newStudent = {
        DOB: '1947-09-21',
        EMAIL: 'Steven.King@gmail.com',
        FIRST_NAME: 'Steven',
        LAST_NAME: 'King',
        INSTRUCTOR_ID: instructorId
    }

    it('TASK-1: Get All Instructors', () => {
        cy.request({
            method: 'GET',
            url: baseUrl,
        }).then((response) => {
            expect(response.status).to.eq(200)

            cy.log(JSON.stringify(response.body))

            expect(response.body.length).to.be.eq(4)

            response.body.forEach((instructor, index) => {
                expect(instructor).to.have.property('INSTRUCTOR_ID')
                expect(instructor).to.have.property('FULLNAME')
                expect(instructor).to.have.property('STUDENTS').that.is.an('array')
                expect(instructor.INSTRUCTOR_ID).to.be.eq(index + 1)
            })
        })
    })

    it('TASK-2: Get A Single Instructor', () => {

        cy.request({
            method: 'GET',
            url: `${baseUrl}/${instructorId}`,
        }).then((response) => {
            expect(response.status).to.eq(200)

            expect(response.body.INSTRUCTOR_ID).to.eq(instructorId)
            expect(response.body).to.have.property('FULLNAME')
            expect(response.body).to.have.property('STUDENTS').that.is.an('array')
        })
    })

    
    it('TASK-3: Create a New Student and Validate the Instructor', () => {
        cy.request({
            method: 'POST',
            url: studentsBaseURL,
            body: newStudent
        }).then((response) => {
            expect(response.status).to.eq(201)

            newStudentId = response.body.STUDENT_ID;
        })

        cy.request({
            method: 'GET',
            url: `${baseUrl}/${instructorId}`,
        }).then((response) => {
            expect(response.status).to.eq(200)

            const studentExists = response.body.STUDENTS.some(student => student.STUDENT_ID === newStudentId);
            expect(studentExists).to.be.true;

            cy.request({
                method: 'DELETE',
                url: `${studentsBaseURL}/${newStudentId}`,
            }).then((response) => {
                expect(response.status).to.eq(204)
            })
        })  
    })
})