import { session } from './db-conn'
import { formatNode, formatPropertyValue, formatNodeResult } from './db-utils'
import uuidv4 from 'uuid/v4'

const newUser = ( user ) => 
    session.run(
        `CREATE (u:User $userProps)
        RETURN u`,
        { userProps:  { ...user, uuid: uuidv4() } } 
      ).then( result => formatNode(result.records[0].get(0)) )

const newUserBook = ( book , bookOwnerId ) => 
    session.run(
        `MATCH (u:User { uuid: $bookOwnerId })
        CREATE (b:Book $bookProps)-[r1:OWNER] -> (u)
        CREATE (b)-[r2:BOOK_USER {role:'ADMIN'}]->(u)
        CREATE (u)-[rf:FOCUS]->(p:Person { uuid: $p_uuid, name:u.name})-[r4:USER]->(u)
        RETURN b`,
        { bookProps: { ...book, uuid: uuidv4() } , p_uuid: uuidv4(), bookOwnerId }
    ).then( result => formatNode(result.records[0].get(0)) )


const newFamilyAndChild = (child, parentId) => 
    session.run(
        `MATCH (parent:Person { uuid: $parentId })
        CREATE (parent)-[rf:FAMILY]->(f:Family)-[rc:CHILD]->(child:Person $childProps)
        RETURN child`,
        { childProps: { ...child, uuid: uuidv4() } , parentId }
    ).then( result => formatNode(result.records[0].get(0)) )

const newChild = (child, familyId) => 
    session.run(
        `MATCH (f:Family { uuid: $familyId })
        CREATE (child:Person $childProps)<-[r:CHILD]-(f)
        RETURN child`,
        { childProps: { ...child, uuid: uuidv4() } , familyId }
).then( result => formatNode(result.records[0].get(0)) )


const newFamilyAndParent = (parent, childId) => 
session.run(
    `MATCH (child:Person { uuid: $childId } )
    CREATE (parent:Person $parentProps)-[rf:FAMILY]->(f:Family)-[rc:CHILD]->(child)
    RETURN parent`,
    { parentProps: { ...parent, uuid: uuidv4() } , childId }
).then( result => formatNode(result.records[0].get(0)) )

const newParent = (parent, familyId) => 
    session.run(
        `MATCH (f:Family { uuid: $familyId })
        CREATE (parent:Person $parentProps)-[r:FAMILY]->(f)
        RETURN parent`,
        { parentProps: { ...parent, uuid: uuidv4() } , familyId }
).then( result => formatNode(result.records[0].get(0)) )

const newFamilyAndPartner = (partner, personId)  => 
session.run(
    `MATCH (person:Person { uuid: $personId } )
    CREATE (partner:Person $partnerProps)->[rf1:FAMILY]-(f:Family)<-[rf2:FAMILY]-(person)
    RETURN parent`,
    { childProps: { ...partner, uuid: uuidv4() } , personId }
).then( result => formatNode(result.records[0].get(0)) )

const newPartner = (partner, familyId) => 
    session.run(
        `MATCH (f:Family { uuid: $familyId })
        CREATE (partner:Person $partnerProps)-[r:FAMILY]->(f)
        RETURN parent`,
        { partnerProps: { ...partner, uuid: uuidv4() } , familyId }
).then( result => formatNode(result.records[0].get(0)) )

const getFamilyId = (personId) => 
    session.run(
        `MATCH (p:Person { uuid: $personId })<--(f:Family)
        RETURN f.uuid`,
        { personId }
).then( result => { console.log(result); return formatPropertyValue(result.records[0])  } )

const getUserByUserName = (userName) =>
    session.run(
        `MATCH (u:User { userName: $userName })
        RETURN u`,
        { userName }
    ).then( result => formatNodeResult(result) );

const getUserByUUID = (userUUID) =>
    session.run(
        `MATCH (u:User { uuid: $userUUID })
        RETURN u`,
        { userUUID }
    ).then( result => formatNodeResult(result) );

export {
    newUser,
    newUserBook,
    newFamilyAndChild,
    newFamilyAndParent,
    newFamilyAndPartner,
    newChild,
    newParent,
    newPartner,
    getFamilyId,
    getUserByUserName,
    getUserByUUID
}