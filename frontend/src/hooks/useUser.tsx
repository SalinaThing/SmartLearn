import { useSelector } from "react-redux";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

export const useUser = () => {
    const { user: reduxUser } = useSelector((state: any) => state.auth);
    const { data, isLoading, isFetching, refetch } = useLoadUserQuery(undefined, {
        refetchOnMountOrArgChange: false, // Don't force refetch by default
    });

    const user = reduxUser || data?.user;
    const isAuthenticated = !!user;

    return {
        user,
        isLoading: isLoading && !data, // Only truly loading if no data in cache
        isFetching,
        isAuthenticated,
        refetch,
    };
};
