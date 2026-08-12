import { fetchPastebinData } from '@/lib/utils';
import DesktopClient from './desktopClient';

export default async function Page() {
  const [games, tools, others] = await Promise.all([
    fetchPastebinData('xayZybCv'),
    fetchPastebinData('FN3RPfRQ'),
    fetchPastebinData('7R4FGRZW'),
  ]);

  const projectsData = {
    "itch.io": [],
    "Github": [],
    "Home": [],
    Games: games,
    Tools: tools,
    Others: others
  };

  return <DesktopClient projectsData={projectsData} />;
}