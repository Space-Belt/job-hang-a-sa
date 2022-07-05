import { dbService } from 'fbase';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { ItemTypes, RootState } from 'store';

type Props = {
    items: ItemTypes | undefined;
    docc: string | undefined;
};

const ChatOut = (props: Props) => {
    const router = useRouter();
    const { items, docc } = props;
    const { currentUser } = useSelector(
        (state: RootState) => state.currentUser,
    );

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (docc) {
            const collectionRef = collection(dbService, 'chats');
            const q = query(collectionRef, where('id', '==', docc));
            if (confirm('채팅방을 나가시겠습니까?') && q) {
                const unsubscribes = onSnapshot(q, async (querySnapshot) => {
                    if (querySnapshot.docs[0]) {
                        const chatRoom = querySnapshot.docs[0].data();
                        if (currentUser.uid === items?.userId) {
                            const newState = [chatRoom.onOff[0], 'off'];
                            await updateDoc(doc(dbService, 'chats', docc), {
                                onOff: [...newState],
                            });
                        } else {
                            const newState = ['off', chatRoom.onOff[1]];
                            await updateDoc(doc(dbService, 'chats', docc), {
                                onOff: [...newState],
                            });
                        }
                        if (
                            chatRoom.onOff.every(
                                (check: string) => check === 'off',
                            )
                        ) {
                            await deleteDoc(doc(dbService, 'chats', docc));
                        }
                    }
                });
                router.push('/');
            } else return;
        }
    };
    return <div onClick={handleClick}>채팅방 나가기</div>;
};

export default ChatOut;
