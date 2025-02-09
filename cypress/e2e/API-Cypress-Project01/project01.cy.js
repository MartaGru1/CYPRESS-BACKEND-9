/// <reference types='cypress'/>

const baseUrl = 'https://api.tech-global-training.com/students'

const newStudent = {
    DOB: '1947-09-21',
    EMAIL: 'Steven.King@gmail.com',
    FIRST_NAME: 'Steven',
    LAST_NAME: 'King',
    INSTRUCTOR_ID: 3
}

const updatedStudent = {
    DOB: '1947-09-21',
    EMAIL: 'Steven.King@gmail.com',
    FIRST_NAME: 'Steven',
    LAST_NAME: 'King',
    INSTRUCTOR_ID: 2
}

describe('TechGlobal Student APIs', () => {
    let studentID
    it('Get all students', () => {
        cy.request({
            method: 'GET',
            url: baseUrl,
        }).then((response) => {
            expect(response.status).to.eq(200)

            cy.log(JSON.stringify(response.body))

            expect(response.body.length).to.be.greaterThan(1)

            response.body.forEach((student) => {
                expect(student).to.have.property('STUDENT_ID')
            })
        })
    })

    it('Create a new student', () => {

        cy.request({
            method: 'POST',
            url: baseUrl,
            body: newStudent
        }).then((response) => {
            expect(response.status).to.eq(201)
            studentID = response.body.STUDENT_ID
            
            expect(studentID).to.be.greaterThan(2)

            expect(response.body.DOB).to.eq(newStudent.DOB)
            expect(response.body.EMAIL).to.eq(newStudent.EMAIL)
            expect(response.body.FIRST_NAME).to.eq(newStudent.FIRST_NAME)
            expect(response.body.LAST_NAME).to.eq(newStudent.LAST_NAME)
            expect(response.body.INSTRUCTOR_ID).to.eq(newStudent.INSTRUCTOR_ID)
        })
    })

    it('Get Newly Created Student', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/${studentID}`,
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.STUDENT_ID).to.eq(studentID)
            expect(response.body.DOB.split('T')[0]).to.eq(newStudent.DOB)
            expect(response.body.EMAIL).to.eq(newStudent.EMAIL)
            expect(response.body.FIRST_NAME).to.eq(newStudent.FIRST_NAME)
            expect(response.body.LAST_NAME).to.eq(newStudent.LAST_NAME)
            expect(response.body.INSTRUCTOR_ID).to.eq(newStudent.INSTRUCTOR_ID)
        })
    })

    it('Update newly created student with a different instructor', () => {
   
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/${studentID}`,
            body: updatedStudent
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.include(`Successfully updated ${updatedStudent.FIRST_NAME}`)
            console.log(JSON.stringify(response.body))
        })
    })

    it('Delete Newly Created Student', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/${studentID}`
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq(`Successfully deleted user with Id: ${studentID}`)
        })
    })
})
























