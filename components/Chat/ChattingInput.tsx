import React, { Dispatch, SetStateAction, useEffect } from 'react';
import styled from '@emotion/styled';
import { useState } from 'react';
import {
    addDoc,
    collection,
    doc,
    DocumentData,
    getDocs,
    onSnapshot,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { dbService } from 'fbase';
import { useSelector } from 'react-redux';
import { ItemTypes, RootState } from 'store';

type Props = {
    setNewMessage: Dispatch<SetStateAction<string>>;
    newMessage: string;
    chatId: string | string[] | undefined;
    items: ItemTypes | undefined;
    docId: string;
    setDocId: Dispatch<SetStateAction<string>>;
};

const ChattingInput = (props: Props) => {
    const { setNewMessage, newMessage, chatId, items, docId, setDocId } = props;

    const { currentUser } = useSelector(
        (state: RootState) => state.currentUser,
    );

    const chatsRef = collection(dbService, 'chats');
    const q = query(
        chatsRef,
        where('users', 'array-contains', currentUser.uid),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((document) => {
            if (document.data().requestId === chatId) {
                setDocId(document.data().id);
            }
        });
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (docId) {
            const addChatRef = collection(
                dbService,
                'chats',
                docId,
                'messages',
            );
            await addDoc(addChatRef, {
                timestamp: serverTimestamp(),
                message: newMessage,
                user: currentUser.email,
                nickName: currentUser.nickName,
            });
        }
        setNewMessage('');
    };
    return (
        <Container onSubmit={handleOnSubmit}>
            <TextArea
                id="story"
                name="story"
                onChange={handleOnChange}
                value={newMessage}
            />
            <Send type="submit" value="전송" />
        </Container>
    );
};

const Container = styled.form`
    width: 100%;
`;
const TextArea = styled.textarea`
    width: 80%;
    height: 100%;
`;

const Send = styled.input`
    height: 100%;
    width: 15%;
`;
export default ChattingInput;

// const querySnapShot = await getDocs(q);
// const chatAlreadyExist = (chatId: string | string[] | undefined) =>
//     !!querySnapShot?.docs.find(
//         (chat) =>
//             chat.data().users.find((user: string) => user === chatId)
//                 ?.length > 0,
//     );
// console.log(' 채팅 생성 ');
// if (!chatAlreadyExist(chatId)) {

// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     querySnapshot.forEach(async (document) => {
//         if (
//             document.data().requestId !== chatId &&
//             !document
//                 .data()
//                 .users.find((user: string) => user === items?.userId) &&
//             document.data().title !== items?.title
//         ) {
//             const docRef = await addDoc(chatsRef, {
//                 title: items?.title,
//                 requestId: chatId,
//                 users: [currentUser.uid, items?.userId],
//             });
//             setchatNum(docRef.id);
//             console.log('채팅방 생성');
//             return;
//         } else {
//             console.log('채팅방이 이미있습니다');
//             return;
//         }
//     });
// });

// const chatsRef = collection(dbService, 'chats');

// const q = query(
//     chatsRef,
//     where('users', 'array-contains', currentUser.uid),
// );
// const querySnapShot = await getDocs(q);
// const userAlreadyExist = (userid: string | string[] | undefined) =>
//     !!querySnapShot?.docs.find(
//         (chat) =>
//             chat
//                 .data()
//                 .users.find(
//                     (user: string | string[] | undefined) =>
//                         user === userid,
//                 )?.length > 0,
//     );

// const idAlreadyExist = (id: string | string[] | undefined) =>
//     !!querySnapShot?.docs.find((chat) => chat.data().requestId === id);

// 메세지 보내기
// if (!userAlreadyExist(items?.userId) && !idAlreadyExist(chatId)) {
//     const docRef = await addDoc(chatsRef, {
//         title: items?.title,
//         requestId: chatId,
//         nickName: [currentUser.nickName, items?.nickName],
//         users: [currentUser.uid, chatId],
//     });
//     const q =
//         // const c = query(
//         //     chatsRef,
//         //     where('users', 'array-contains', currentUser.uid),
//         // );
// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const messageArray = querySnapshot.docs.forEach(
//         (doc: QueryDocumentSnapshot<DocumentData>) => ({
//             ...doc.data(),
//             id: doc.id,
//         }),
//     );
// });

//         // await addDoc(messagesRef, {
//         //     timestamp: serverTimestamp(),
//         //     message: newMessage,
//         // });
//         setNewMessage('');
//     console.log('채팅방 생성!');
//     return;
// } else {
//     console.log('이미존재');
//     return;
// }
// setNewMessage('');

// if (!chatAlreadyExist(items?.userId, items?.id)) {

// } else {
//     console.log('이미 존재합니다');
//     setNewMessage('');
//     return;
// }
