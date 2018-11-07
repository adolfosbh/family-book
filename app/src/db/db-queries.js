import { driver } from './db-conn'
import { formatNode, formatPropertyValue, formatNodeResult } from './db-utils'
import uuidv4 from 'uuid/v4'


const runQuery = (query, parameters) => {
    const session = driver.session()
    return session.run(query,parameters).then( result => {
        session.close();
        return result;
    })
}
const newUser = ( user ) => 
    runQuery(
        `CREATE (u:User $userProps)
        RETURN u`,
        { userProps:  { ...user, uuid: uuidv4() } } 
      ).then( result => formatNode(result.records[0].get(0)) )

const newUserBook = ( book , bookOwnerId ) => 
    runQuery(
        `MATCH (u:User { uuid: $bookOwnerId })
        CREATE (b:Book $bookProps)-[r1:OWNER] -> (u)
        CREATE (b)-[r2:BOOK_USER {role:'ADMIN'}]->(u)
        CREATE (u)-[rf:FOCUS]->(p:Person { uuid: $p_uuid, name:u.name})-[r4:USER]->(u)
        RETURN b`,
        { bookProps: { ...book, uuid: uuidv4() } , p_uuid: uuidv4(), bookOwnerId }
    ).then( result => formatNode(result.records[0].get(0)) )


const newFamilyAndChild = (child, parentId) => 
    runQuery(
        `MATCH (parent:Person { uuid: $parentId })
        CREATE (parent)-[rf:FAMILY]->(f:Family)-[rc:CHILD]->(child:Person $childProps)
        RETURN child`,
        { childProps: { ...child, uuid: uuidv4() } , parentId }
    ).then( result => formatNode(result.records[0].get(0)) )

const newChild = (child, familyId) => 
    runQuery(
        `MATCH (f:Family { uuid: $familyId })
        CREATE (child:Person $childProps)<-[r:CHILD]-(f)
        RETURN child`,
        { childProps: { ...child, uuid: uuidv4() } , familyId }
    ).then( result => formatNode(result.records[0].get(0)) )


const newFamilyAndParent = (parent, childId) => 
    runQuery(
        `MATCH (child:Person { uuid: $childId } )
        CREATE (parent:Person $parentProps)-[rf:FAMILY]->(f:Family)-[rc:CHILD]->(child)
        RETURN parent`,
        { parentProps: { ...parent, uuid: uuidv4() } , childId }
    ).then( result => formatNode(result.records[0].get(0)) )

const newParent = (parent, familyId) => 
    runQuery(
        `MATCH (f:Family { uuid: $familyId })
        CREATE (parent:Person $parentProps)-[r:FAMILY]->(f)
        RETURN parent`,
        { parentProps: { ...parent, uuid: uuidv4() } , familyId }
    ).then( result => formatNode(result.records[0].get(0)) )

const newFamilyAndPartner = (partner, personId)  => 
    runQuery(
        `MATCH (person:Person { uuid: $personId } )
        CREATE (partner:Person $partnerProps)->[rf1:FAMILY]-(f:Family)<-[rf2:FAMILY]-(person)
        RETURN parent`,
        { childProps: { ...partner, uuid: uuidv4() } , personId }
    ).then( result => formatNode(result.records[0].get(0)) )

const newPartner = (partner, familyId) => 
    runQuery(
        `MATCH (f:Family { uuid: $familyId })
        CREATE (partner:Person $partnerProps)-[r:FAMILY]->(f)
        RETURN parent`,
        { partnerProps: { ...partner, uuid: uuidv4() } , familyId }
).then( result => formatNode(result.records[0].get(0)) )

const getFamilyId = (personId) => 
    runQuery(
        `MATCH (p:Person { uuid: $personId })<--(f:Family)
        RETURN f.uuid`,
        { personId }
).then( result => { console.log(result); return formatPropertyValue(result.records[0])  } )

const getUserByUserName = (userName) =>
    runQuery(
        `MATCH (u:User { userName: $userName })
        RETURN u`,
        { userName }
    ).then( result => formatNodeResult(result) );

const getUserByUUID = (userUUID) =>
    runQuery(
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