import React from 'react';
import styled from '@emotion/styled';
import FilterBtn from 'components/Filter/FilterBtn';
import SearchBox from 'components/Search';
import Link from 'next/link';

type Props = {};

const Header = (props: Props) => {
    return (
        <HeaderContainer>
            <Link href={'/'}>
                <Title>잡행어사</Title>
            </Link>
            <HeaderBox>
                <FilterBtn />
                <SearchBox />
            </HeaderBox>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    width: 100%;
    flex: 1.5 1 0;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    width: 100%;
    height: 6vh;
    padding: 1vh 0;
    line-height: 6vh;
    text-align: center;
    font-size: 35px;
    background-color: skyblue;
    cursor: pointer;
`;

const HeaderBox = styled.div`
    height: 100%;
    display: flex;
    width: 100%;
`;

export default Header;
