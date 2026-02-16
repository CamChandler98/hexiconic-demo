import { router } from "expo-router";
import { GemButton } from "../General/GemButton";
import { AppText } from "../General/ui/AppText";
export const StartButton = () => {

    const goSelect = () => {
        router.push({
            pathname:"/puzzle_select"
        })
    }

    return(
        <GemButton 
            color="#ffd6e0" 
            onPress={goSelect}
            width={120}
            height={48}    
        >
            <AppText variant="buttonText">
            Play
            </AppText>
        </GemButton>

    )
}