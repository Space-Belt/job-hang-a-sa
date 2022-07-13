import { dbService } from 'fbase';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ItemTypes, RootState } from 'store';
import styled from '@emotion/styled';
import { getTimeDate } from 'utils/dateFormat';
import colors from 'styles/colors';

type Props = {
    items: ItemTypes | undefined;
};

export interface ChatContentType {
    message?: string;
    timeStamp?: string;
    user?: string | undefined;
    id?: string | undefined;
    nickName?: string | undefined;
}

const Conversations = (props: Props) => {
    const date = new Date();
    const { items } = props;
    const [messages, setMessages] = useState<ChatContentType[]>([]);
    const { currentUser } = useSelector(
        (state: RootState) => state.currentUser,
    );
    const { docId } = useSelector((state: RootState) => state.docId);
    const [isOn, setIsOn] = useState<boolean>();
    const lastMessageRef = useRef<null | HTMLDivElement>(null);
    const bottomScroll = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        bottomScroll();
    }, [messages]);
    useEffect(() => {
        if (docId !== '') {
            const chatRef = collection(dbService, 'chats', docId, 'messages');
            const g = query(chatRef, orderBy('timestamp', 'asc'));

            const unsubscribe = onSnapshot(g, async (querySnapshot) => {
                const mes = await querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    timeStamp: getTimeDate(doc.data().timestamp?.toDate()),
                }));
                setMessages(mes);
            });
        }
    }, [messages, docId]);

    useEffect(() => {
        if (docId !== '') {
            const collectionRef = collection(dbService, 'chats');
            const q = query(collectionRef, where('id', '==', docId));
            const onOffCheck = onSnapshot(q, (querySnapshot) => {
                if (querySnapshot.docs[0]) {
                    let chatOnOff;
                    if (currentUser.uid === items?.userId) {
                        chatOnOff = querySnapshot.docs[0].data().onOff[1];
                    } else {
                        chatOnOff = querySnapshot.docs[0].data().onOff[0];
                    }
                    if (chatOnOff === 'on') {
                        setIsOn(true);
                    } else if (chatOnOff === 'off') {
                        setIsOn(false);
                    }
                }
            });
        }
    }, [messages, docId]);

    return (
        <ContentBox>
            {messages &&
                isOn &&
                messages.map((a, i) => {
                    if (a.user === currentUser.email) {
                        return (
                            <MyMessage key={i}>
                                <Message>
                                    <div>{a.message}</div>
                                </Message>
                                <div>
                                    <div>{a.timeStamp}</div>
                                </div>
                            </MyMessage>
                        );
                    } else {
                        return (
                            <OpponentMessage key={i}>
                                <div>{a.nickName}</div>

                                <div>{a.message}</div>
                                <div>{a.timeStamp}</div>
                            </OpponentMessage>
                        );
                    }
                })}
            <LastOfMessages ref={lastMessageRef} />
        </ContentBox>
    );
};

const ContentBox = styled.div`
    width: 100%;
    flex: 8.5 1 0;
    position: relative;
`;

const MyMessage = styled.div`
    position: relative;
    display: flex;
    text-align: right;
    flex-direction: row-reverse;
    /* height: 10%; */
    width: 390px;
`;

const Message = styled.div`
    border-radius: 15px;
    background-color: ${colors.gold};
`;

const OpponentMessage = styled.div`
    position: relative;
    text-align: left;
    display: flex;
    /* height: 10%; */
    width: 390px;
`;

const Omessage = styled.div`
    display: flex;
    flex-direction: column;
`;

const LastOfMessages = styled.div`
    margin-bottom: 100;
`;

export default Conversations;
