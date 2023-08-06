import { AiFillHome ,AiOutlineSetting} from 'react-icons/ai';
import { BsFillBookmarkFill,BsSend,BsStars ,BsChevronBarExpand} from 'react-icons/bs';
export const stats = [
  {
    id: 1,
    name: 'Posts',
    stats: 1000
  },
  {
    id: 2,
    name: 'Following',
    stats: 1000
  },
  {
    id: 3,
    name: 'Followers',
    stats: 1000
  },
];

export const navigations = [
  {
    id: 1,
    name: 'Feed',
    icon: <AiFillHome />
  },
  {
    id: 2,
    name: 'My Favourites',
    icon: < BsFillBookmarkFill />
  },
  {
    id: 3,
    name: 'Direct',
    icon: <BsSend />
  },
  {
    id: 4,
    name: 'Status',
    icon: <BsStars />
  },
  {
    id: 5,
    name: 'Settings',
    icon: <AiOutlineSetting />
  },
  {
    id: 6,
    name: 'Explore',
    icon: <BsChevronBarExpand />
  },
];
