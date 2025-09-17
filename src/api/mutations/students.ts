import { gql } from "@apollo/client";

export const CREATE_STUDENT = gql`
  mutation CreateStudent(
    $name: String!
    $email: String!
    $username: String!
    $matricNo: String!
    $pictureUrl: String
    $department: String
    $course: String
    $grade: String
    $score: Int
  ) {
    createStudent(
      name: $name
      email: $email
      username: $username
      matricNo: $matricNo
      pictureUrl: $pictureUrl
      department: $department
      course: $course
      grade: $grade
      score: $score
    ) {
      id
      name
      email
      username
      matricNo
      pictureUrl
      department
      course
      grade
      score
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!
    $name: String
    $email: String
    $username: String
    $matricNo: String
    $pictureUrl: String
    $department: String
    $course: String
    $grade: String
    $score: Int
  ) {
    updateStudent(
      id: $id
      name: $name
      email: $email
      username: $username
      matricNo: $matricNo
      pictureUrl: $pictureUrl
      department: $department
      course: $course
      grade: $grade
      score: $score
    ) {
      id
      name
      email
      username
      matricNo
      pictureUrl
      department
      course
      grade
      score
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      success
      id
    }
  }
`;
