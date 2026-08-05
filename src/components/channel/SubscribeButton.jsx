import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { subscriptionApi } from "../../api/subscriptionApi";
import Button from "../common/Button";

function SubscribeButton({
    channelId,
    initialIsSubscribed = false,
    initialCount = 0,
}) {
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const currentUser = useSelector(
        (state) => state.auth.user
    );

    const [isSubscribed, setIsSubscribed] = useState(
        initialIsSubscribed
    );

    const [count, setCount] = useState(
        initialCount
    );

    const [isLoading, setIsLoading] = useState(false);

    const isOwner =
        currentUser?._id &&
        String(currentUser._id) === String(channelId);

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            toast.error("Sign in to subscribe");
            return;
        }

        if (isOwner) {
            return;
        }

        // Save previous state for rollback
        const previousSubscribed = isSubscribed;
        const previousCount = count;

        // Optimistic update
        setIsSubscribed(!previousSubscribed);

        setCount(
            previousSubscribed
                ? Math.max(0, previousCount - 1)
                : previousCount + 1
        );

        setIsLoading(true);

        try {
            await subscriptionApi.toggleSubscription(
                channelId
            );
        } catch (error) {
            // Rollback optimistic update
            setIsSubscribed(previousSubscribed);
            setCount(previousCount);

            toast.error(
                error?.message ||
                    "Failed to update subscription"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isOwner) {
        return null;
    }

    return (
        <Button
            type="button"
            variant={
                isSubscribed
                    ? "secondary"
                    : "primary"
            }
            size="md"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleSubscribe}
            leftIcon={
                isSubscribed ? (
                    <Check size={17} />
                ) : (
                    <Plus size={17} />
                )
            }
            className={
                isSubscribed
                    ? "group min-w-[120px]"
                    : "min-w-[120px]"
            }
        >
            {isSubscribed ? (
                <span className="group-hover:hidden">
                    Subscribed
                </span>
            ) : (
                "Subscribe"
            )}

            {isSubscribed && (
                <span className="hidden group-hover:inline">
                    Unsubscribe
                </span>
            )}
        </Button>
    );
}

export default SubscribeButton;